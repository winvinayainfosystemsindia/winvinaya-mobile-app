import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import PostgresDsn, field_validator
from typing import Any, List, Optional


def get_env_file() -> str:
    env = os.getenv("ENVIRONMENT", "development").lower()
    if env == "production":
        return ".env.prod"
    elif env == "qa":
        return ".env.qa"
    return ".env"


class Settings(BaseSettings):
    # ─── Application ────────────────────────────────────────────────────────
    APP_NAME: str = "Winvinaya LMS"
    APP_VERSION: str = "2.0.0"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"

    # ─── Server ─────────────────────────────────────────────────────────────
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 4
    BASE_URL: str = "http://localhost:8000"

    # ─── CORS ───────────────────────────────────────────────────────────────
    ALLOWED_ORIGINS: List[str] = ["*"]

    # ─── Database ───────────────────────────────────────────────────────────
    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_PORT: str = "5432"

    DATABASE_URL: Optional[str] = None
    SYNC_DATABASE_URL: Optional[str] = None

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: Optional[str], info: Any) -> Any:
        if isinstance(v, str) and v:
            return v
        d = info.data
        return f"postgresql+asyncpg://{d['POSTGRES_USER']}:{d['POSTGRES_PASSWORD']}@{d['POSTGRES_SERVER']}:{d['POSTGRES_PORT']}/{d['POSTGRES_DB']}"

    @field_validator("SYNC_DATABASE_URL", mode="before")
    @classmethod
    def assemble_sync_db_connection(cls, v: Optional[str], info: Any) -> Any:
        if isinstance(v, str) and v:
            return v
        d = info.data
        return f"postgresql://{d['POSTGRES_USER']}:{d['POSTGRES_PASSWORD']}@{d['POSTGRES_SERVER']}:{d['POSTGRES_PORT']}/{d['POSTGRES_DB']}"

    # ─── Security / JWT ─────────────────────────────────────────────────────
    SECRET_KEY: str = "changeme-use-a-real-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # ─── Redis / Celery ─────────────────────────────────────────────────────
    USE_REDIS: bool = True
    REDIS_URL: str = "redis://redis:6379/0"
    CELERY_BROKER_URL: str = "redis://redis:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://redis:6379/1"
    # Cache uses DB 2 so it's isolated from Celery broker (DB 0) and results (DB 1)
    REDIS_CACHE_DB: int = 2
    CACHE_DEFAULT_TTL: int = 300  # 5 minutes

    # ─── Local Storage ──────────────────────────────────────────────────────
    STORAGE_ROOT: str = "/app/storage"

    # Video
    MAX_VIDEO_SIZE_MB: int = 2048                # 2 GB
    ALLOWED_VIDEO_TYPES: List[str] = [".mp4", ".webm", ".mkv", ".mov", ".avi"]

    # Documents
    MAX_FILE_SIZE_MB: int = 50
    ALLOWED_DOC_TYPES: List[str] = [".pdf", ".docx", ".pptx", ".xlsx", ".zip", ".txt"]

    # Images
    MAX_IMAGE_SIZE_MB: int = 10
    THUMBNAIL_WIDTH: int = 1280
    THUMBNAIL_HEIGHT: int = 720
    AVATAR_SIZE: int = 256

    # ─── OAuth 2.0 Providers (all optional) ────────────────────────────────
    # Google
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None

    # Microsoft Azure AD
    AZURE_CLIENT_ID: Optional[str] = None
    AZURE_CLIENT_SECRET: Optional[str] = None
    AZURE_TENANT_ID: Optional[str] = "common"

    # GitHub
    GITHUB_CLIENT_ID: Optional[str] = None
    GITHUB_CLIENT_SECRET: Optional[str] = None

    # Redirect base for OAuth callbacks
    OAUTH_REDIRECT_BASE: str = "http://localhost:8000"

    # ─── Signed Share Tokens (video sharing) ────────────────────────────────
    SHARE_TOKEN_SECRET: str = "changeme-share-token-secret"
    SHARE_TOKEN_TTL_SECONDS: int = 86400  # 24 hours

    # ─── Email / SMTP ────────────────────────────────────────────────────────
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = "noreply@winvinaya.com"
    SMTP_FROM_NAME: str = "Winvinaya LMS"

    # ─── Legacy (kept for backward compat) ──────────────────────────────────
    UPLOAD_DIR: str = "/app/uploads"
    MAX_CONTENT_LENGTH: int = 1073741824  # 1GB

    model_config = SettingsConfigDict(
        env_file=get_env_file(),
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
