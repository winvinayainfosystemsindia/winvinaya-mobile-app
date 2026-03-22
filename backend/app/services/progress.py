from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.course import Course, Lesson, Module
from app.models.progress import LessonProgress, CourseProgress, LessonProgressStatus


class ProgressService:
    @staticmethod
    async def can_access_lesson(db: AsyncSession, user_id: int, lesson_id: int) -> bool:
        """
        Checks if a user can access a specific lesson based on the course's 
        require_sequential setting.
        """
        stmt = select(Lesson).filter_by(id=lesson_id)
        result = await db.execute(stmt)
        lesson = result.scalars().first()
        if not lesson:
            return False
            
        stmt = select(Course).join(Module).filter(Module.id == lesson.module_id)
        result = await db.execute(stmt)
        course = result.scalars().first()
        if not course or not course.require_sequential:
            return True

        # Find all lessons in the course that come BEFORE this one
        stmt = select(Lesson).join(Module).filter(
            Lesson.module_id == Module.id,
            Module.course_id == course.id
        ).filter(
            (Module.order < lesson.module.order) | 
            ((Module.order == lesson.module.order) & (Lesson.order < lesson.order))
        )
        result = await db.execute(stmt)
        prev_lessons = result.scalars().all()

        for prev in prev_lessons:
            stmt = select(LessonProgress).filter_by(user_id=user_id, lesson_id=prev.id)
            result = await db.execute(stmt)
            progress = result.scalars().first()
            if not progress or progress.status != LessonProgressStatus.completed:
                return False
        
        return True

    @staticmethod
    async def mark_lesson_complete(db: AsyncSession, user_id: int, lesson_id: int, score: float = None):
        """
        Marks a lesson as complete and updates overall course progress.
        """
        stmt = select(LessonProgress).filter_by(user_id=user_id, lesson_id=lesson_id)
        result = await db.execute(stmt)
        progress = result.scalars().first()
        
        if not progress:
            progress = LessonProgress(user_id=user_id, lesson_id=lesson_id)
            db.add(progress)
            
        if progress.status != LessonProgressStatus.completed:
            progress.status = LessonProgressStatus.completed
            progress.completed_at = datetime.utcnow()
            if score is not None:
                progress.score = score
            
            await db.commit()
            await ProgressService.update_course_progress(db, user_id, lesson_id)

    @staticmethod
    async def update_course_progress(db: AsyncSession, user_id: int, lesson_id: int):
        # Find the course
        stmt = select(Lesson).filter_by(id=lesson_id)
        result = await db.execute(stmt)
        lesson = result.scalars().first()
        course_id = lesson.module.course_id
        
        # Count total lessons vs completed
        total_stmt = select(func.count(Lesson.id)).join(Module).filter(Module.course_id == course_id)
        total_result = await db.execute(total_stmt)
        total_lessons = total_result.scalar() or 0
        
        comp_stmt = select(func.count(LessonProgress.id)).join(Lesson).join(Module).filter(
            LessonProgress.user_id == user_id,
            Module.course_id == course_id,
            LessonProgress.status == LessonProgressStatus.completed
        )
        comp_result = await db.execute(comp_stmt)
        completed_lessons = comp_result.scalar() or 0
        
        percent = (completed_lessons / total_lessons * 100) if total_lessons > 0 else 0
        
        stmt = select(CourseProgress).filter_by(user_id=user_id, course_id=course_id)
        result = await db.execute(stmt)
        course_progress = result.scalars().first()
        
        if not course_progress:
            course_progress = CourseProgress(user_id=user_id, course_id=course_id)
            db.add(course_progress)
            
        course_progress.lessons_completed = completed_lessons
        course_progress.total_lessons = total_lessons
        course_progress.percent_complete = percent
        await db.commit()
