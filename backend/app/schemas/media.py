from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

from app.models.media import MediaType, MediaStatus


class MediaFileCreate(BaseModel):
    original_filename: str
    storage_path: str
    mime_type: str
    size_bytes: int
    media_type: MediaType
    status: MediaStatus = MediaStatus.uploading
    uploaded_by: int
    duration_seconds: Optional[int] = None
    width: Optional[int] = None
    height: Optional[int] = None


class MediaFileUpdate(BaseModel):
    status: Optional[MediaStatus] = None
    duration_seconds: Optional[int] = None
    width: Optional[int] = None
    height: Optional[int] = None


class MediaFileResponse(BaseModel):
    id: int
    public_id: UUID
    original_filename: str
    mime_type: str
    size_bytes: int
    media_type: MediaType
    status: MediaStatus
    duration_seconds: Optional[int]
    url: Optional[str] = None   # populated by service layer

    class Config:
        from_attributes = True
