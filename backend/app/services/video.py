"""
VideoService — handles video upload, validation, and byte-range HTTP streaming.
"""
import os
import mimetypes
from typing import Optional, Tuple

from fastapi import UploadFile
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import ValidationError, StorageError, NotFoundError
from app.models.media import MediaFile, MediaStatus, MediaType
from app.services.storage import storage_service
from app.repositories.media import media_repository
from app.schemas.media import MediaFileCreate


class VideoService:

    def _validate(self, file: UploadFile, size_hint: Optional[int] = None) -> None:
        """Validate file extension and optional size."""
        ext = os.path.splitext(file.filename or "")[1].lower()
        if ext not in settings.ALLOWED_VIDEO_TYPES:
            raise ValidationError(
                f"Unsupported video type '{ext}'. Allowed: {', '.join(settings.ALLOWED_VIDEO_TYPES)}"
            )

    def _build_path(self, course_id: int, module_id: int, lesson_id: int, filename: str) -> str:
        """Build the relative storage path for a video file."""
        ext = os.path.splitext(filename)[1].lower()
        safe_name = f"{lesson_id}{ext}"
        return f"videos/{course_id}/{module_id}/{lesson_id}/original/{safe_name}"

    async def upload(
        self,
        db: AsyncSession,
        file: UploadFile,
        course_id: int,
        module_id: int,
        lesson_id: int,
        uploader_id: int,
    ) -> MediaFile:
        """Upload a video file and create a MediaFile record (status=uploading)."""
        self._validate(file)

        relative_path = self._build_path(course_id, module_id, lesson_id, file.filename)

        # Persist file to disk
        await storage_service.save(file, relative_path)

        size_bytes = storage_service.get_size(relative_path)
        mime_type = mimetypes.guess_type(file.filename)[0] or "video/mp4"

        # Create DB record
        media_in = MediaFileCreate(
            original_filename=file.filename,
            storage_path=relative_path,
            mime_type=mime_type,
            size_bytes=size_bytes,
            media_type=MediaType.video,
            status=MediaStatus.processing,
            uploaded_by=uploader_id,
            duration_seconds=None,
        )
        media_obj = await media_repository.create(db, obj_in=media_in)

        # Dispatch Celery task to extract video metadata
        from app.tasks.video_processing import extract_video_metadata
        extract_video_metadata.delay(media_obj.id, relative_path)

        return media_obj

    async def stream(
        self,
        db: AsyncSession,
        media_id: int,
        range_header: Optional[str],
    ) -> StreamingResponse:
        """Stream video with HTTP 206 byte-range support."""
        media: Optional[MediaFile] = await media_repository.get(db, media_id)
        if not media or media.media_type != MediaType.video:
            raise NotFoundError("Video")

        if not storage_service.exists(media.storage_path):
            raise StorageError("Video file not found on disk.")

        file_size = storage_service.get_size(media.storage_path)
        start = 0
        end = file_size - 1

        status_code = 200
        headers = {
            "Accept-Ranges": "bytes",
            "Content-Type": media.mime_type or "video/mp4",
        }

        if range_header:
            try:
                range_val = range_header.replace("bytes=", "")
                s, e = range_val.split("-")
                start = int(s)
                end = int(e) if e else file_size - 1
                status_code = 206
                headers["Content-Range"] = f"bytes {start}-{end}/{file_size}"
                headers["Content-Length"] = str(end - start + 1)
            except Exception:
                pass
        else:
            headers["Content-Length"] = str(file_size)

        return StreamingResponse(
            storage_service.stream(media.storage_path, start, end),
            status_code=status_code,
            headers=headers,
            media_type=media.mime_type or "video/mp4",
        )


video_service = VideoService()
