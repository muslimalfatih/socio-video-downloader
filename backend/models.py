from sqlmodel import SQLModel, Field, create_engine, Session
from typing import Optional
from datetime import datetime
from enum import Enum
import uuid
import os

class DownloadStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class Download(SQLModel, table=True):
    __tablename__ = "downloads"
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    client_id: str = Field(index=True)  # Hashed IP+UserAgent for anonymous users
    url: str
    platform: str
    title: Optional[str] = None
    file_size: Optional[int] = None
    format: Optional[str] = None
    status: DownloadStatus = Field(default=DownloadStatus.PENDING)
    download_url: Optional[str] = None
    expires_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.now, index=True)

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

def create_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
