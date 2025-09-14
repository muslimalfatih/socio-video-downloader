from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl

# Change these imports - remove 'services'
from app.platform_detector import PlatformDetector
from app.video_info_extractor import get_video_info

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoInfoRequest(BaseModel):
    url: HttpUrl

@app.get("/")
async def root():
    return {"message": "Socio Video Downloader API"}

@app.post("/api/video-info")
async def fetch_video_info(request: VideoInfoRequest):
    platform = PlatformDetector.detect_platform(str(request.url))
    if platform["platform"] == "unknown":
        raise HTTPException(400, "Unsupported platform")
    
    info = get_video_info(str(request.url))
    if "error" in info:
        raise HTTPException(400, info["error"])
    
    return info
