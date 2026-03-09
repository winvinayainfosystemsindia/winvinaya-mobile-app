from celery import Celery
from app.core.config import settings

# ─── Celery Application ──────────────────────────────────────────────────────

celery_app = Celery(
    "lms_worker",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
    include=[
        "app.tasks.video_processing",
    ],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="Asia/Kolkata",
    enable_utc=True,
    task_routes={
        "app.tasks.video_processing.*": {"queue": "video"},
        "*": {"queue": "default"},
    },
    worker_prefetch_multiplier=1,  # Fair task distribution for long-running video tasks
    task_acks_late=True,           # Re-queue on worker crash
)
