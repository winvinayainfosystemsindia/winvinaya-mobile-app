"""
Media endpoint — upload, stream, share (video/documents/images).

Rate limits are applied to upload and streaming endpoints.
Video share tokens allow embedding in external LMS players.
"""
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, Header, HTTPException, Request, UploadFile, status
from fastapi.responses import StreamingResponse, RedirectResponse
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.dependencies import get_current_user, get_current_instructor
from app.core.exceptions import NotFoundError
from app.db.session import get_db
from app.middleware.rate_limit import limiter, LIMIT_UPLOAD, LIMIT_STREAM
from app.models.media import MediaType, MediaStatus
from app.repositories.media import media_repository
from app.schemas.media import MediaFileResponse
from app.services.file import file_service
from app.services.storage import storage_service
from app.services.video import video_service

router = APIRouter()

# ── Share-token signer ─────────────────────────────────────────────────────────
_signer = URLSafeTimedSerializer(settings.SHARE_TOKEN_SECRET, salt="video-share")


def _make_share_token(public_id: str) -> str:
    return _signer.dumps({"public_id": public_id})


def _verify_share_token(token: str) -> Optional[str]:
    try:
        data = _signer.loads(token, max_age=settings.SHARE_TOKEN_TTL_SECONDS)
        return data.get("public_id")
    except (SignatureExpired, BadSignature):
        return None


# ── Video upload ───────────────────────────────────────────────────────────────

@router.post(
    "/video",
    response_model=MediaFileResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a video for a lesson (rate-limited: 5/min)",
)
@limiter.limit(LIMIT_UPLOAD)
async def upload_video(
    request: Request,
    file: UploadFile = File(...),
    course_id: int = Form(...),
    module_id: int = Form(...),
    lesson_id: int = Form(...),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_instructor),
):
    """
    Upload a video file. Size is validated against MAX_VIDEO_SIZE_MB.
    Celery task will transcode to HLS and extract metadata asynchronously.
    """
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


# ── Video stream (authenticated) ───────────────────────────────────────────────

@router.get(
    "/video/{media_id}/stream",
    summary="Stream video with byte-range support (rate-limited: 60/min)",
)
@limiter.limit(LIMIT_STREAM)
async def stream_video(
    request: Request,
    media_id: int,
    range: Optional[str] = Header(default=None),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """HTTP 206 Partial Content streaming for seek-able video playback."""
    return await video_service.stream(db=db, media_id=media_id, range_header=range)


# ── Video share token ──────────────────────────────────────────────────────────

@router.post(
    "/{public_id}/share-token",
    summary="Generate a signed, time-limited share URL for a video",
)
async def create_share_token(
    public_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Returns a signed token valid for SHARE_TOKEN_TTL_SECONDS (default 24 h).
    The token can be embedded in any external LMS player via the stream-by-token endpoint.
    """
    media = await media_repository.get_by_public_id(db, str(public_id))
    if not media or media.media_type != MediaType.video:
        raise NotFoundError("Video")
    if media.status != MediaStatus.ready:
        raise HTTPException(status_code=400, detail="Video is not ready for sharing yet.")

    token = _make_share_token(str(public_id))
    stream_url = f"{settings.BASE_URL}{settings.API_V1_PREFIX}/media/stream/{token}"
    hls_url = None
    hls_path = media.storage_path.replace("original/", "hls/").rsplit("/", 1)[0] + "/master.m3u8"
    if storage_service.exists(hls_path):
        hls_url = f"{settings.BASE_URL}{settings.API_V1_PREFIX}/media/stream/{token}?format=hls"

    return {
        "share_token": token,
        "stream_url": stream_url,
        "hls_url": hls_url,
        "expires_in_seconds": settings.SHARE_TOKEN_TTL_SECONDS,
        "message": "Use stream_url in <video src=...> or hls_url with hls.js in any external LMS.",
    }


@router.get(
    "/stream/{share_token}",
    summary="Public video stream via signed share token (embeddable in external LMS)",
    include_in_schema=True,
)
async def stream_by_share_token(
    share_token: str,
    format: Optional[str] = None,   # "hls" → serve master.m3u8, else raw MP4
    range: Optional[str] = Header(default=None),
    db: AsyncSession = Depends(get_db),
):
    """
    No authentication required — access is controlled by the signed token.
    Supports both raw MP4 streaming (206 byte-range) and HLS manifest serving.
    Add CORS headers so external players can load the stream cross-origin.
    """
    public_id = _verify_share_token(share_token)
    if not public_id:
        raise HTTPException(status_code=401, detail="Invalid or expired share token.")

    media = await media_repository.get_by_public_id(db, public_id)
    if not media or media.media_type != MediaType.video:
        raise NotFoundError("Video")
    if media.status != MediaStatus.ready:
        raise HTTPException(status_code=400, detail="Video is not ready.")

    # Serve HLS master playlist if requested and available
    if format == "hls":
        hls_path = media.storage_path.replace("original/", "hls/").rsplit("/", 1)[0] + "/master.m3u8"
        if storage_service.exists(hls_path):
            file_size = storage_service.get_size(hls_path)
            return StreamingResponse(
                storage_service.stream(hls_path, 0, file_size - 1),
                media_type="application/vnd.apple.mpegurl",
                headers={
                    "Access-Control-Allow-Origin": "*",
                    "Cache-Control": "no-cache",
                },
            )

    # Fall back to raw MP4 byte-range streaming
    response = await video_service.stream(db=db, media_id=media.id, range_header=range)
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response


# ── Document ──────────────────────────────────────────────────────────────────

@router.post(
    "/document",
    response_model=MediaFileResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a document for a lesson",
)
@limiter.limit(LIMIT_UPLOAD)
async def upload_document(
    request: Request,
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


# ── Thumbnail ──────────────────────────────────────────────────────────────────

@router.post(
    "/thumbnail/{course_id}",
    response_model=MediaFileResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload course thumbnail (auto-resized to 1280×720, WebP)",
)
@limiter.limit(LIMIT_UPLOAD)
async def upload_thumbnail(
    request: Request,
    course_id: int,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_instructor),
):
    media = await file_service.upload_thumbnail(
        db=db, file=file, course_id=course_id, uploader_id=current_user.id
    )
    resp = MediaFileResponse.model_validate(media)
    resp.url = storage_service.get_url(media.storage_path)
    return resp


# ── Avatar ────────────────────────────────────────────────────────────────────

@router.post(
    "/avatar",
    response_model=MediaFileResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload user avatar (auto-resized to 256×256, WebP)",
)
@limiter.limit(LIMIT_UPLOAD)
async def upload_avatar(
    request: Request,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    media = await file_service.upload_avatar(db=db, file=file, user_id=current_user.id)
    resp = MediaFileResponse.model_validate(media)
    resp.url = storage_service.get_url(media.storage_path)
    return resp


# ── Delete ────────────────────────────────────────────────────────────────────

@router.delete(
    "/{media_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a media file (instructor/admin only)",
)
async def delete_media(
    media_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_instructor),
):
    media = await media_repository.get(db, media_id)
    if not media:
        raise NotFoundError("Media file")

    if media.media_type == MediaType.video:
        await video_service.cleanup_video(media)
    else:
        await storage_service.delete(media.storage_path)

    await media_repository.remove(db, id=media_id)
