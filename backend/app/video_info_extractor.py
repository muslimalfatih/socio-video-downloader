import yt_dlp
from .platform_detector import PlatformDetector  # Import your detector

def get_video_info(url: str) -> dict:
    ydl_opts = {"quiet": True, "skip_download": True}
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            info = ydl.extract_info(url, download=False)
            return {
                "title": info.get("title"),
                "platform": PlatformDetector.detect_platform(url)["platform"],
                "thumbnail": info.get("thumbnail"),
                "duration": info.get("duration"),
                "formats": [f["format_note"] for f in info.get("formats", []) if "format_note" in f]
            }
        except Exception as e:
            return {"error": str(e)}
