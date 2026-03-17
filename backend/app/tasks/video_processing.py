"""
Celery tasks for video processing.
Runs in the `video` queue — isolated from the API workers.

Pipeline:
  1. extract_video_metadata  — probe with ffprobe
  2. transcode_video_to_hls  — multi-bitrate HLS (360p / 720p / 1080p)
     └─ per-rendition:        ffmpeg → segment into /hls/{rendition}/*.ts + playlist
     └─ master manifest:      master.m3u8 referencing all renditions
  3. generate_video_thumbnail — capture frame at 10% of duration
  4. compute_course_duration  — sum all lesson durations and update Course
"""
import logging
import os
import math

from app.tasks import celery_app
from app.core.config import settings

logger = logging.getLogger(__name__)

# ── HLS Rendition profiles ─────────────────────────────────────────────────────
# Each entry: (name, height, video_bitrate_k, audio_bitrate_k)
HLS_RENDITIONS = [
    ("360p",  360,  500,  64),
    ("720p",  720, 2500, 128),
    ("1080p", 1080, 5000, 192),
]
HLS_SEGMENT_DURATION = 6   # seconds


def _sync_session():
    """Create a disposable sync SQLAlchemy session for use inside Celery."""
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    engine = create_engine(settings.SYNC_DATABASE_URL)
    Session = sessionmaker(bind=engine)
    return engine, Session()


def _update_media(session, media_id: int, **kwargs):
    from sqlalchemy import update
    from app.models.media import MediaFile
    session.execute(update(MediaFile).where(MediaFile.id == media_id).values(**kwargs))
    session.commit()


# ── Task 1: Extract metadata & kick off transcoding ───────────────────────────

@celery_app.task(
    bind=True,
    name="app.tasks.video_processing.extract_video_metadata",
    queue="video",
    max_retries=3,
    default_retry_delay=30,
)
def extract_video_metadata(self, media_id: int, relative_path: str):
    """
    Probe the uploaded file, update MediaFile metadata, then
    chain → transcode_video_to_hls.
    """
    import ffmpeg
    abs_path = os.path.join(settings.STORAGE_ROOT, relative_path)
    engine, session = _sync_session()
    try:
        probe = ffmpeg.probe(abs_path)
        video_streams = [s for s in probe["streams"] if s["codec_type"] == "video"]
        if not video_streams:
            raise ValueError("No video stream found.")

        vs = video_streams[0]
        duration = int(float(probe.get("format", {}).get("duration", 0)))
        width = int(vs.get("width", 0))
        height = int(vs.get("height", 0))

        from app.models.media import MediaStatus
        _update_media(session, media_id,
                      duration_seconds=duration, width=width, height=height,
                      status=MediaStatus.processing)

        logger.info("[media:%d] Metadata extracted: %ds %dx%d — queuing HLS transcode", media_id, duration, width, height)

        # Chain to HLS transcode
        transcode_video_to_hls.delay(media_id, relative_path, duration, width, height)

    except Exception as exc:
        logger.error("[media:%d] Metadata extraction failed: %s", media_id, exc)
        try:
            from app.models.media import MediaStatus
            _update_media(session, media_id, status=MediaStatus.failed)
        except Exception:
            pass
        raise self.retry(exc=exc)
    finally:
        session.close()
        engine.dispose()


# ── Task 2: Multi-bitrate HLS transcode ───────────────────────────────────────

@celery_app.task(
    bind=True,
    name="app.tasks.video_processing.transcode_video_to_hls",
    queue="video",
    max_retries=2,
    default_retry_delay=60,
    time_limit=7200,  # 2-hour hard timeout
)
def transcode_video_to_hls(
    self,
    media_id: int,
    relative_path: str,
    duration: int,
    src_width: int,
    src_height: int,
):
    """
    Transcode the original upload into multi-bitrate HLS segments.

    Output directory layout:
        storage/videos/{course}/{module}/{lesson}/hls/
            master.m3u8
            360p/playlist.m3u8   +  360p/seg_*.ts
            720p/playlist.m3u8   +  720p/seg_*.ts
            1080p/playlist.m3u8  +  1080p/seg_*.ts  (only if src ≥ 1080)
    """
    import ffmpeg

    abs_input = os.path.join(settings.STORAGE_ROOT, relative_path)
    # Derive HLS base dir: replace "original/<file>" → "hls/"
    hls_base = os.path.join(
        settings.STORAGE_ROOT,
        os.path.dirname(relative_path).replace("/original", "/hls"),
    )
    os.makedirs(hls_base, exist_ok=True)

    master_lines = ["#EXTM3U", "#EXT-X-VERSION:3", ""]
    rendition_paths = []  # relative paths for DB / sharing logic

    try:
        for name, height, vbitrate, abitrate in HLS_RENDITIONS:
            # Skip renditions that exceed the source resolution
            if src_height > 0 and height > src_height * 1.1:
                logger.info("[media:%d] Skipping %s rendition (src height=%d)", media_id, name, src_height)
                continue

            out_dir = os.path.join(hls_base, name)
            os.makedirs(out_dir, exist_ok=True)
            playlist_path = os.path.join(out_dir, "playlist.m3u8")
            segment_pattern = os.path.join(out_dir, "seg_%05d.ts")

            # Compute output width maintaining aspect ratio (must be even)
            if src_width > 0 and src_height > 0:
                out_width = math.floor(src_width * height / src_height)
                if out_width % 2 != 0:
                    out_width += 1
                vf = f"scale={out_width}:{height}"
            else:
                vf = f"scale=-2:{height}"

            logger.info("[media:%d] Transcoding %s (%s) → %s", media_id, name, vf, out_dir)

            (
                ffmpeg
                .input(abs_input)
                .output(
                    playlist_path,
                    vf=vf,
                    vcodec="libx264",
                    acodec="aac",
                    video_bitrate=f"{vbitrate}k",
                    audio_bitrate=f"{abitrate}k",
                    preset="fast",
                    hls_time=HLS_SEGMENT_DURATION,
                    hls_list_size=0,
                    hls_segment_filename=segment_pattern,
                    format="hls",
                )
                .overwrite_output()
                .run(quiet=True)
            )

            # Append rendition to master manifest
            master_lines += [
                f"#EXT-X-STREAM-INF:BANDWIDTH={vbitrate * 1000},RESOLUTION={out_width if src_width else 'auto'}x{height}",
                f"{name}/playlist.m3u8",
                "",
            ]
            rendition_paths.append(name)
            logger.info("[media:%d] %s rendition done", media_id, name)

        # Write master playlist
        master_path = os.path.join(hls_base, "master.m3u8")
        with open(master_path, "w") as f:
            f.write("\n".join(master_lines))

        logger.info("[media:%d] HLS master written → %s", media_id, master_path)

        # Mark ready + kick off thumbnail generation
        engine, session = _sync_session()
        try:
            from app.models.media import MediaStatus
            _update_media(session, media_id, status=MediaStatus.ready)
        finally:
            session.close()
            engine.dispose()

        generate_video_thumbnail.delay(media_id, relative_path, duration)

    except Exception as exc:
        logger.error("[media:%d] HLS transcode failed: %s", media_id, exc)
        engine, session = _sync_session()
        try:
            from app.models.media import MediaStatus
            _update_media(session, media_id, status=MediaStatus.failed)
        finally:
            session.close()
            engine.dispose()
        raise self.retry(exc=exc)


# ── Task 3: Thumbnail generation ──────────────────────────────────────────────

@celery_app.task(
    name="app.tasks.video_processing.generate_video_thumbnail",
    queue="video",
)
def generate_video_thumbnail(media_id: int, relative_path: str, duration: int):
    """
    Extract a thumbnail frame at 10% of the video duration using ffmpeg.
    Saves as JPEG to: storage/.../thumbs/thumb.jpg
    """
    import ffmpeg

    abs_input = os.path.join(settings.STORAGE_ROOT, relative_path)
    thumb_dir = os.path.join(
        settings.STORAGE_ROOT,
        os.path.dirname(relative_path).replace("/original", "/thumbs"),
    )
    os.makedirs(thumb_dir, exist_ok=True)
    thumb_path = os.path.join(thumb_dir, "thumb.jpg")

    seek_time = max(1, int(duration * 0.1)) if duration else 5

    try:
        (
            ffmpeg
            .input(abs_input, ss=seek_time)
            .output(thumb_path, vframes=1, format="image2", vcodec="mjpeg")
            .overwrite_output()
            .run(quiet=True)
        )
        logger.info("[media:%d] Thumbnail saved → %s", media_id, thumb_path)
    except Exception as exc:
        logger.warning("[media:%d] Thumbnail generation failed: %s", media_id, exc)
        # Non-fatal — don't retry or mark failed


# ── Task 4: Recompute course total duration ───────────────────────────────────

@celery_app.task(
    name="app.tasks.video_processing.compute_course_duration",
    queue="default",
)
def compute_course_duration(course_id: int):
    """
    Sum lesson durations and update Course.duration_minutes.
    Called after upload + successful metadata extraction.
    """
    from sqlalchemy import create_engine, select, update, func
    from sqlalchemy.orm import sessionmaker
    from app.models.course import Course, Module, Lesson

    engine = create_engine(settings.SYNC_DATABASE_URL)
    Session = sessionmaker(bind=engine)
    with Session() as session:
        total_seconds = session.execute(
            select(func.sum(Lesson.duration_seconds))
            .join(Module, Module.id == Lesson.module_id)
            .where(Module.course_id == course_id)
        ).scalar() or 0

        session.execute(
            update(Course)
            .where(Course.id == course_id)
            .values(duration_minutes=total_seconds // 60)
        )
        session.commit()
    engine.dispose()
    logger.info("[course:%d] duration recomputed → %d min", course_id, total_seconds // 60)
