"""
VideoService — handles video upload validation and byte-range HTTP streaming.

Key features:
  - Pre-upload size validation via Content-Length header (returns 413 if over limit)
  - Streaming byte-read with per-chunk size accounting (avoids reading all to memory)
  - HTTP 206 partial content streaming for seek-able playback
  - Prefers HLS master.m3u8 for stream endpoint when transcoding is complete
"""
import os
import mimetypes
from typing import Optional

from fastapi import HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import ValidationError, StorageError, NotFoundError
from app.models.media import MediaFile, MediaStatus, MediaType
from app.services.storage import storage_service
from app.repositories.media import media_repository
from app.schemas.media import MediaFileCreate


class VideoService:

    MAX_BYTES: int = settings.MAX_VIDEO_SIZE_MB * 1024 * 1024

    def _validate_extension(self, file: UploadFile) -> str:
        """Validate file extension. Returns the lowercase extension."""
        ext = os.path.splitext(file.filename or "")[1].lower()
        if ext not in settings.ALLOWED_VIDEO_TYPES:
            raise ValidationError(
                f"Unsupported video type '{ext}'. Allowed: {', '.join(settings.ALLOWED_VIDEO_TYPES)}"
            )
        return ext

    def _validate_size_header(self, file: UploadFile) -> None:
        """
        Reject early via Content-Length header if present and over limit.
        This avoids reading a multi-gigabyte file before discovering it's too large.
        """
        if file.size is not None and file.size > self.MAX_BYTES:
            raise HTTPException(
                status_code=413,
                detail=(
                    f"Video file exceeds the maximum allowed size of "
                    f"{settings.MAX_VIDEO_SIZE_MB} MB. "
                    f"Received: {file.size / (1024**2):.1f} MB."
                ),
            )

    def _build_path(self, course_id: int, module_id: int, lesson_id: int, filename: str) -> str:
        """
        Build the storage path for the original upload.
        e.g. videos/12/3/45/original/45.mp4
        """
        ext = os.path.splitext(filename)[1].lower()
        return f"videos/{course_id}/{module_id}/{lesson_id}/original/{lesson_id}{ext}"

    async def upload(
        self,
        db: AsyncSession,
        file: UploadFile,
        course_id: int,
        module_id: int,
        lesson_id: int,
        uploader_id: int,
    ) -> MediaFile:
        """
        Validate, persist, and create the MediaFile record (status=processing).
        Celery task chain: extract_video_metadata → transcode_video_to_hls → generate_video_thumbnail
        """
        self._validate_extension(file)
        self._validate_size_header(file)

        relative_path = self._build_path(course_id, module_id, lesson_id, file.filename)

        # Stream-write to disk with running byte counter (catches size limit mid-upload)
        abs_path = os.path.join(settings.STORAGE_ROOT, relative_path)
        os.makedirs(os.path.dirname(abs_path), exist_ok=True)

        total_bytes = 0
        CHUNK = 1024 * 1024  # 1 MB
        import aiofiles
        async with aiofiles.open(abs_path, "wb") as out:
            while True:
                chunk = await file.read(CHUNK)
                if not chunk:
                    break
                total_bytes += len(chunk)
                if total_bytes > self.MAX_BYTES:
                    # Delete partial file before raising
                    await aiofiles.os.remove(abs_path)
                    raise HTTPException(
                        status_code=413,
                        detail=(
                            f"Video upload aborted: file exceeded {settings.MAX_VIDEO_SIZE_MB} MB "
                            f"limit mid-stream."
                        ),
                    )
                await out.write(chunk)

        mime_type = mimetypes.guess_type(file.filename)[0] or "video/mp4"

        media_in = MediaFileCreate(
            original_filename=file.filename,
            storage_path=relative_path,
            mime_type=mime_type,
            size_bytes=total_bytes,
            media_type=MediaType.video,
            status=MediaStatus.processing,
            uploaded_by=uploader_id,
            duration_seconds=None,
        )
        media_obj = await media_repository.create(db, obj_in=media_in)

        # Dispatch Celery task chain: probe → HLS transcode → thumbnail
        from app.tasks.video_processing import extract_video_metadata
        extract_video_metadata.delay(media_obj.id, relative_path)

        return media_obj

    async def stream(
        self,
        db: AsyncSession,
        media_id: int,
        range_header: Optional[str],
    ) -> StreamingResponse:
        """
        Stream a video with HTTP 206 byte-range support.
        If HLS is available (post-transcode), a redirect to the HLS manifest is preferred
        for adaptive bitrate playback.
        """
        media: Optional[MediaFile] = await media_repository.get(db, media_id)
        if not media or media.media_type != MediaType.video:
            raise NotFoundError("Video")

        if not storage_service.exists(media.storage_path):
            raise StorageError("Video file not found on disk.")

        # Check if HLS master playlist exists (preferred for ABR streaming)
        hls_path = media.storage_path.replace("/original/", "/hls/").rsplit("/", 1)[0] + "/master.m3u8"
        if storage_service.exists(hls_path):
            file_size = storage_service.get_size(hls_path)
            return StreamingResponse(
                storage_service.stream(hls_path, 0, file_size - 1),
                status_code=200,
                media_type="application/vnd.apple.mpegurl",
                headers={
                    "Cache-Control": "no-cache",
                    "X-Stream-Type": "hls",
                },
            )

        # Fall back to raw MP4 byte-range stream
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
