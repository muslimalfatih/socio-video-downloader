import yt_dlp
from .platform_detector import PlatformDetector

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
                "original_url": url,
                "formats": [
                    {
                        "format_note": f.get("format_note", "Unknown"),
                        "ext": f.get("ext", "mp4"),
                        "filesize": f.get("filesize")
                    }
                    for f in info.get("formats", [])
                    if f.get("format_note") and "audio" not in f.get("format_note", "").lower()
                ][:5]  # Limit to 5 formats for UI
            }
        except Exception as e:
            return {"error": str(e)}
