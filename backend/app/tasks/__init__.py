from celery import Celery
from app.core.config import settings

# ─── Celery Application ──────────────────────────────────────────────────────

if settings.USE_REDIS:
    celery_app = Celery(
        "lms_worker",
        broker=settings.CELERY_BROKER_URL,
        backend=settings.CELERY_RESULT_BACKEND,
        include=[
            "app.tasks.video_processing",
        ],
    )
else:
    # Redis-less fallback: synchronous execution (no worker process needed)
    celery_app = Celery(
        "lms_worker",
        broker="memory://",
        backend="cache+memory://",
        include=[
            "app.tasks.video_processing",
        ],
    )
    celery_app.conf.update(
        task_always_eager=True,
        task_eager_propagates=True,
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
    worker_prefetch_multiplier=1,
    task_acks_late=True,
)
