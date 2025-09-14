from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import Optional
from sqlmodel import Session
import os

from app.models import create_tables, get_session, Download
from app.services.platform_detector import PlatformDetector
from app.services.video_info_extractor import get_video_info
from app.services.rate_limiter import RateLimiter
from app.services.download_service import VideoDownloadService
from app.utils.client_utils import get_client_identifier

app = FastAPI(title="Socio Video Downloader API", version="1.0.0")

# CORS
app.add_middleware(
  CORSMiddleware,
  allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# Initialize services
rate_limiter = RateLimiter()
download_service = VideoDownloadService()

class VideoInfoRequest(BaseModel):
  url: HttpUrl

class DownloadRequest(BaseModel):
  url: HttpUrl
  format: Optional[str] = "best[height<=720]"

@app.on_event("startup")
async def startup():
  create_tables()

@app.get("/")
async def root():
  return {
    "message": "Socio Video Downloader API",
    "version": "1.0.0",
    "daily_limit": 5
  }

@app.post("/api/video-info")
async def fetch_video_info(request: VideoInfoRequest):
    platform = PlatformDetector.detect_platform(str(request.url))
    if platform["platform"] == "unknown":
        raise HTTPException(400, "Unsupported platform")
    
    info = get_video_info(str(request.url))
    if "error" in info:
        raise HTTPException(400, info["error"])
    
    return info

@app.get("/api/usage")
async def get_usage_info(request: Request):
    client_id = get_client_identifier(request)
    usage = await rate_limiter.get_usage_info(client_id)
    return usage

@app.post("/api/download")
async def download_video(
    download_request: DownloadRequest,
    request: Request,
    session: Session = Depends(get_session)
):
    client_id = get_client_identifier(request)
    
    try:
        rate_check = await rate_limiter.check_rate_limit(client_id)
    except HTTPException as e:
        usage = await rate_limiter.get_usage_info(client_id)
        error_detail = e.detail
        if isinstance(error_detail, dict):
            error_detail.update(usage)
        raise HTTPException(429, error_detail)
    
    platform = PlatformDetector.detect_platform(str(download_request.url))
    if platform["platform"] == "unknown":
        raise HTTPException(400, "Unsupported platform")
    
    try:
        result = await download_service.download_video(
            str(download_request.url),
            download_request.format
        )
        
        # Save to database
        download_record = Download(
            client_id=client_id,
            url=str(download_request.url),
            platform=platform["platform"],
            title=result["title"],
            file_size=result["file_size"],
            format=download_request.format,
            status="completed",
            download_url=result["download_url"],
            expires_at=result["expires_at"]
        )
        
        session.add(download_record)
        session.commit()
        session.refresh(download_record)
        
        return {
            **result,
            "usage": rate_check
        }
        
    except Exception as e:
        raise HTTPException(500, f"Download failed: {str(e)}")

@app.get("/api/history")
async def get_download_history(
    request: Request,
    session: Session = Depends(get_session)
):
    client_id = get_client_identifier(request)
    downloads = session.query(Download).filter(
        Download.client_id == client_id
    ).order_by(Download.created_at.desc()).limit(20).all()
    
    return [
        {
            "id": d.id,
            "title": d.title,
            "platform": d.platform,
            "created_at": d.created_at,
            "file_size": d.file_size,
            "status": d.status
        }
        for d in downloads
    ]
