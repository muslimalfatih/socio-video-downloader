import re
from urllib.parse import urlparse

class PlatformDetector:
  PLATFORMS = {
    "youtube": [r"youtube\.com", r"youtu\.be"],
    "instagram": [r"instagram\.com", r"instagr\.am"],
    "tiktok": [r"tiktok\.com", r"vm\.tiktok\.com"],
    "twitter": [r"twitter\.com", r"x\.com", r"t\.co"],
    "facebook": [r"facebook\.com", r"fb\.watch"],
  }

  @classmethod
  def detect_platform(cls, url: str) -> dict:
    domain = urlparse(url).netloc
    for platform, patterns in cls.PLATFORMS.items():
      if any(re.search(pattern, domain, re.IGNORECASE) for pattern in patterns):
        return {"platform": platform}
    return {"platform": "unknown"}

