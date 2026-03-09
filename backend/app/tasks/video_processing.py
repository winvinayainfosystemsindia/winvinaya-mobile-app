"""
Celery tasks for video processing.
Runs in the `video` queue — heavy operations are isolated from the API workers.
"""
import logging
import os

from app.tasks import celery_app
from app.core.config import settings

logger = logging.getLogger(__name__)


@celery_app.task(
    bind=True,
    name="app.tasks.video_processing.extract_video_metadata",
    queue="video",
    max_retries=3,
    default_retry_delay=30,
)
def extract_video_metadata(self, media_id: int, relative_path: str):
    """
    Extract duration, width, height from an uploaded video using ffprobe.
    Updates the MediaFile record and marks status=ready.
    """
    import ffmpeg
    from sqlalchemy import create_engine, update
    from sqlalchemy.orm import sessionmaker

    from app.core.config import settings as cfg
    from app.models.media import MediaFile, MediaStatus

    abs_path = os.path.join(cfg.STORAGE_ROOT, relative_path)

    try:
        probe = ffmpeg.probe(abs_path)
        video_streams = [s for s in probe["streams"] if s["codec_type"] == "video"]
        if not video_streams:
            raise ValueError("No video stream found in uploaded file.")

        vs = video_streams[0]
        duration = int(float(probe.get("format", {}).get("duration", 0)))
        width = int(vs.get("width", 0))
        height = int(vs.get("height", 0))

        # Use a sync session inside Celery (no asyncio)
        engine = create_engine(cfg.SYNC_DATABASE_URL)
        Session = sessionmaker(bind=engine)
        with Session() as session:
            session.execute(
                update(MediaFile)
                .where(MediaFile.id == media_id)
                .values(
                    duration_seconds=duration,
                    width=width,
                    height=height,
                    status=MediaStatus.ready,
                )
            )
            session.commit()
        engine.dispose()

        logger.info(f"[media:{media_id}] Video metadata extracted: {duration}s {width}x{height}")

    except Exception as exc:
        logger.error(f"[media:{media_id}] Metadata extraction failed: {exc}")
        try:
            engine = create_engine(settings.SYNC_DATABASE_URL)
            Session = sessionmaker(bind=engine)
            with Session() as session:
                session.execute(
                    update(MediaFile)
                    .where(MediaFile.id == media_id)
                    .values(status=MediaStatus.failed)
                )
                session.commit()
            engine.dispose()
        except Exception:
            pass
        raise self.retry(exc=exc)


@celery_app.task(
    name="app.tasks.video_processing.compute_course_duration",
    queue="default",
)
def compute_course_duration(course_id: int):
    """
    Recompute and update the total duration_minutes for a course
    by summing all its lessons' duration_seconds.
    """
    from sqlalchemy import create_engine, select, update, func
    from sqlalchemy.orm import sessionmaker

    from app.core.config import settings as cfg
    from app.models.course import Course, Module, Lesson

    engine = create_engine(cfg.SYNC_DATABASE_URL)
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
    logger.info(f"[course:{course_id}] duration recomputed → {total_seconds // 60} min")
