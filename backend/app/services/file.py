"""
FileService — handles document, thumbnail, and avatar uploads.
"""
import os
import io
import mimetypes
import uuid

from fastapi import UploadFile
from PIL import Image
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.exceptions import ValidationError
from app.models.media import MediaFile, MediaStatus, MediaType
from app.services.storage import storage_service
from app.repositories.media import media_repository
from app.schemas.media import MediaFileCreate


class FileService:

    # ─── Documents ────────────────────────────────────────────────────────────

    async def upload_document(
        self,
        db: AsyncSession,
        file: UploadFile,
        course_id: int,
        lesson_id: int,
        uploader_id: int,
    ) -> MediaFile:
        ext = os.path.splitext(file.filename or "")[1].lower()
        if ext not in settings.ALLOWED_DOC_TYPES:
            raise ValidationError(
                f"Unsupported document type '{ext}'. Allowed: {', '.join(settings.ALLOWED_DOC_TYPES)}"
            )

        safe_name = f"{uuid.uuid4().hex}{ext}"
        relative_path = f"documents/{course_id}/{lesson_id}/{safe_name}"
        await storage_service.save(file, relative_path)
        size_bytes = storage_service.get_size(relative_path)
        mime_type = mimetypes.guess_type(file.filename)[0] or "application/octet-stream"

        media_in = MediaFileCreate(
            original_filename=file.filename,
            storage_path=relative_path,
            mime_type=mime_type,
            size_bytes=size_bytes,
            media_type=MediaType.document,
            status=MediaStatus.ready,
            uploaded_by=uploader_id,
        )
        return await media_repository.create(db, obj_in=media_in)

    # ─── Thumbnails ───────────────────────────────────────────────────────────

    async def upload_thumbnail(
        self,
        db: AsyncSession,
        file: UploadFile,
        course_id: int,
        uploader_id: int,
    ) -> MediaFile:
        content = await file.read()
        img = Image.open(io.BytesIO(content)).convert("RGB")
        img = img.resize(
            (settings.THUMBNAIL_WIDTH, settings.THUMBNAIL_HEIGHT),
            Image.LANCZOS,
        )
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=85)
        buf.seek(0)

        relative_path = f"images/thumbnails/{course_id}/thumbnail.jpg"
        await storage_service.save_bytes(buf.read(), relative_path)
        size_bytes = storage_service.get_size(relative_path)

        media_in = MediaFileCreate(
            original_filename=file.filename,
            storage_path=relative_path,
            mime_type="image/jpeg",
            size_bytes=size_bytes,
            media_type=MediaType.image,
            status=MediaStatus.ready,
            uploaded_by=uploader_id,
        )
        return await media_repository.create(db, obj_in=media_in)

    # ─── Avatars ──────────────────────────────────────────────────────────────

    async def upload_avatar(
        self,
        db: AsyncSession,
        file: UploadFile,
        user_id: int,
    ) -> MediaFile:
        content = await file.read()
        img = Image.open(io.BytesIO(content)).convert("RGB")
        size = settings.AVATAR_SIZE
        img = img.resize((size, size), Image.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=90)
        buf.seek(0)

        relative_path = f"images/avatars/{user_id}/avatar.jpg"
        await storage_service.save_bytes(buf.read(), relative_path)
        size_bytes = storage_service.get_size(relative_path)

        media_in = MediaFileCreate(
            original_filename=file.filename,
            storage_path=relative_path,
            mime_type="image/jpeg",
            size_bytes=size_bytes,
            media_type=MediaType.image,
            status=MediaStatus.ready,
            uploaded_by=user_id,
        )
        return await media_repository.create(db, obj_in=media_in)


file_service = FileService()
