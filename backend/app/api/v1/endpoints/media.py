"""
Media endpoint — upload and stream video/documents/images.
"""
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, Header, UploadFile, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, get_current_instructor
from app.core.exceptions import NotFoundError
from app.db.session import get_db
from app.models.media import MediaType
from app.repositories.media import media_repository
from app.schemas.media import MediaFileResponse
from app.services.file import file_service
from app.services.storage import storage_service
from app.services.video import video_service

router = APIRouter()


# ─── Video ───────────────────────────────────────────────────────────────────

@router.post("/video", response_model=MediaFileResponse, status_code=status.HTTP_201_CREATED,
             summary="Upload a video for a lesson")
async def upload_video(
    file: UploadFile = File(...),
    course_id: int = Form(...),
    module_id: int = Form(...),
    lesson_id: int = Form(...),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_instructor),
):
    """Upload a video file. Celery task will extract metadata asynchronously."""
    media = await video_service.upload(
        db=db,
        file=file,
        course_id=course_id,
        module_id=module_id,
        lesson_id=lesson_id,
        uploader_id=current_user.id,
    )
    resp = MediaFileResponse.model_validate(media)
    resp.url = storage_service.get_url(media.storage_path)
    return resp


@router.get("/video/{media_id}/stream", summary="Stream video with byte-range support")
async def stream_video(
    media_id: int,
    range: Optional[str] = Header(default=None),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Supports HTTP 206 Partial Content for seek-able video playback."""
    return await video_service.stream(db=db, media_id=media_id, range_header=range)


# ─── Document ────────────────────────────────────────────────────────────────

@router.post("/document", response_model=MediaFileResponse, status_code=status.HTTP_201_CREATED,
             summary="Upload a document for a lesson")
async def upload_document(
    file: UploadFile = File(...),
    course_id: int = Form(...),
    lesson_id: int = Form(...),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_instructor),
):
    media = await file_service.upload_document(
        db=db, file=file, course_id=course_id, lesson_id=lesson_id, uploader_id=current_user.id
    )
    resp = MediaFileResponse.model_validate(media)
    resp.url = storage_service.get_url(media.storage_path)
    return resp


# ─── Thumbnail ───────────────────────────────────────────────────────────────

@router.post("/thumbnail/{course_id}", response_model=MediaFileResponse, status_code=status.HTTP_201_CREATED,
             summary="Upload course thumbnail (auto-resized to 1280×720)")
async def upload_thumbnail(
    course_id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_instructor),
):
    media = await file_service.upload_thumbnail(db=db, file=file, course_id=course_id, uploader_id=current_user.id)
    resp = MediaFileResponse.model_validate(media)
    resp.url = storage_service.get_url(media.storage_path)
    return resp


# ─── Avatar ──────────────────────────────────────────────────────────────────

@router.post("/avatar", response_model=MediaFileResponse, status_code=status.HTTP_201_CREATED,
             summary="Upload user avatar (auto-resized to 256×256)")
async def upload_avatar(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    media = await file_service.upload_avatar(db=db, file=file, user_id=current_user.id)
    resp = MediaFileResponse.model_validate(media)
    resp.url = storage_service.get_url(media.storage_path)
    return resp


# ─── Delete ──────────────────────────────────────────────────────────────────

@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT,
               summary="Delete a media file (admin only)")
async def delete_media(
    media_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_instructor),
):
    media = await media_repository.get(db, media_id)
    if not media:
        raise NotFoundError("Media file")
    await storage_service.delete(media.storage_path)
    await media_repository.remove(db, id=media_id)
