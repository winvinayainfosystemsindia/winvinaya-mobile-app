import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import PostgresDsn, field_validator
from typing import Any, Dict, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Winvinaya LMS"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "dev_secret"
    ENVIRONMENT: str = "development"
    
    POSTGRES_SERVER: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_PORT: str = "5432"
    
    DATABASE_URL: Optional[str] = None
    SYNC_DATABASE_URL: Optional[str] = None

    # Media Configuration
    UPLOAD_DIR: str = "/app/uploads"
    MAX_CONTENT_LENGTH: int = 1073741824  # 1GB

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: Optional[str], info: Any) -> Any:
        if isinstance(v, str) and v:
            return v
        return f"postgresql+asyncpg://{info.data['POSTGRES_USER']}:{info.data['POSTGRES_PASSWORD']}@{info.data['POSTGRES_SERVER']}:{info.data['POSTGRES_PORT']}/{info.data['POSTGRES_DB']}"

    @field_validator("SYNC_DATABASE_URL", mode="before")
    @classmethod
    def assemble_sync_db_connection(cls, v: Optional[str], info: Any) -> Any:
        if isinstance(v, str) and v:
            return v
        return f"postgresql://{info.data['POSTGRES_USER']}:{info.data['POSTGRES_PASSWORD']}@{info.data['POSTGRES_SERVER']}:{info.data['POSTGRES_PORT']}/{info.data['POSTGRES_DB']}"

    @classmethod
    def get_env_file(cls) -> str:
        env = os.getenv("ENVIRONMENT", "development").lower()
        if env == "production":
            return ".env.prod"
        elif env == "qa":
            return ".env.qa"
        return ".env.dev"

    model_config = SettingsConfigDict(
        env_file=get_env_file(),
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
