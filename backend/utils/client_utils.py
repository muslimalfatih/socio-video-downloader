from fastapi import Request
import hashlib

def get_client_identifier(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        ip = forwarded.split(",")[0].strip()
    else:
        ip = request.client.host
    
    user_agent = request.headers.get("User-Agent", "")
    identifier = f"{ip}:{user_agent}"
    return hashlib.sha256(identifier.encode()).hexdigest()[:16]
