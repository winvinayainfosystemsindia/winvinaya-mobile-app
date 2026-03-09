from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.media import MediaFile
from app.repositories.base import BaseRepository
from app.schemas.media import MediaFileCreate, MediaFileUpdate


class MediaRepository(BaseRepository[MediaFile, MediaFileCreate, MediaFileUpdate]):

    async def get_by_public_id(self, db: AsyncSession, public_id: str) -> Optional[MediaFile]:
        result = await db.execute(
            select(MediaFile).filter(MediaFile.public_id == public_id)
        )
        return result.scalars().first()

    async def get_by_uploader(
        self, db: AsyncSession, user_id: int, skip: int = 0, limit: int = 50
    ) -> List[MediaFile]:
        result = await db.execute(
            select(MediaFile)
            .filter(MediaFile.uploaded_by == user_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()


media_repository = MediaRepository(MediaFile)
