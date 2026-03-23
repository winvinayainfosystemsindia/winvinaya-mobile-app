import os
import logging
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.ppt import PPTSlide
from app.models.media import MediaFile, MediaStatus, MediaType
from app.repositories.media import media_repository
from app.services.storage import storage_service

logger = logging.getLogger(__name__)

class PPTService:
    async def get_slides_by_lesson(self, db: AsyncSession, lesson_id: int) -> List[PPTSlide]:
        """
        Fetch all slides for a given lesson, ordered by slide number.
        """
        result = await db.execute(
            select(PPTSlide)
            .where(PPTSlide.lesson_id == lesson_id)
            .order_by(PPTSlide.slide_no)
        )
        return result.scalars().all()

    async def trigger_conversion(self, db: AsyncSession, lesson_id: int, media_id: int):
        """
        Dispatch the background task to convert PPTX to images.
        """
        # In a real implementation, this would call a Celery task
        # e.g., from app.tasks.ppt_processing import convert_ppt
        # convert_ppt.delay(lesson_id, media_id)
        logger.info(f"Triggering PPT conversion for lesson {lesson_id}, media {media_id}")
        pass

ppt_service = PPTService()
