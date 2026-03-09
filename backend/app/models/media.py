import uuid
import enum
from sqlalchemy import (
    Column, Integer, String, Text, ForeignKey, DateTime, Enum, Boolean, Float
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base


class MediaType(str, enum.Enum):
    video = "video"
    document = "document"
    image = "image"
    certificate = "certificate"


class MediaStatus(str, enum.Enum):
    uploading = "uploading"
    processing = "processing"
    ready = "ready"
    failed = "failed"


class MediaFile(Base):
    __tablename__ = "media_files"

    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(UUID(as_uuid=True), default=uuid.uuid4, unique=True, index=True, nullable=False)

    original_filename = Column(String(500), nullable=False)
    storage_path = Column(String(1000), nullable=False)  # relative to STORAGE_ROOT
    mime_type = Column(String(100), nullable=False)
    size_bytes = Column(Integer, nullable=False)

    media_type = Column(Enum(MediaType), nullable=False)
    status = Column(Enum(MediaStatus), default=MediaStatus.uploading, nullable=False)

    # Video-specific metadata (populated by Celery task)
    duration_seconds = Column(Integer, nullable=True)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)

    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    uploader = relationship("User", back_populates="media_files", foreign_keys=[uploaded_by])
