import yt_dlp
import cloudinary
import cloudinary.uploader
import tempfile
import os
from typing import Dict
from uuid import uuid4
from datetime import datetime, timedelta

class VideoDownloadService:
		def __init__(self):
				cloudinary.config(
						cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
						api_key=os.getenv("CLOUDINARY_API_KEY"),
						api_secret=os.getenv("CLOUDINARY_API_SECRET")
				)

		async def download_video(self, url: str, format_preference: str = "best[height<=720]") -> Dict:
				try:
						download_id = str(uuid4())
						
						with tempfile.TemporaryDirectory() as temp_dir:
								output_path = os.path.join(temp_dir, f"{download_id}.%(ext)s")
								
								ydl_opts = {
										'format': format_preference,
										'outtmpl': output_path,
										'noplaylist': True,
								}
								
								with yt_dlp.YoutubeDL(ydl_opts) as ydl:
										info = ydl.extract_info(url, download=False)
										title = info.get('title', 'Unknown')
										duration = info.get('duration', 0)
										
										ydl.download([url])
										
										downloaded_files = [f for f in os.listdir(temp_dir) if f.startswith(download_id)]
										if not downloaded_files:
												raise Exception("Download failed - no file created")
										
										file_path = os.path.join(temp_dir, downloaded_files[0])
										file_size = os.path.getsize(file_path)
										
										upload_result = cloudinary.uploader.upload_large(
												file_path,
												resource_type="video",
												public_id=f"downloads/{download_id}",
										)
										
										return {
												"download_id": download_id,
												"title": title,
												"duration": duration,
												"file_size": file_size,
												"download_url": upload_result["secure_url"],
												"expires_at": datetime.now() + timedelta(hours=24)
										}
										
				except Exception as e:
						raise Exception(f"Download failed: {str(e)}")
