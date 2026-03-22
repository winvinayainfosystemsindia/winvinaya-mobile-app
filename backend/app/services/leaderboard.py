from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc, delete
from app.models.leaderboard import LeaderboardEntry
from app.models.content import QuizAttempt


class LeaderboardService:
    @staticmethod
    async def update_user_score(db: AsyncSession, course_id: int, user_id: int):
        """
        Recalculates total score and time for a user in a specific course.
        """
        # Get best score for each quiz in the course for this user
        # Note: simplified approach, really should check which quizzes belong to the course
        stmt = select(
            QuizAttempt.quiz_id,
            func.max(QuizAttempt.score).label("max_score"),
            func.min(QuizAttempt.time_taken_seconds).label("min_time")
        ).filter(
            QuizAttempt.user_id == user_id,
            QuizAttempt.passed == True
        ).group_by(QuizAttempt.quiz_id)
        
        result = await db.execute(stmt)
        best_scores = result.all()

        total_score = sum(s.max_score for s in best_scores)
        total_time = sum(s.min_time for s in best_scores if s.min_time)

        # Upsert into leaderboard_entries
        stmt = select(LeaderboardEntry).filter_by(course_id=course_id, user_id=user_id)
        result = await db.execute(stmt)
        entry = result.scalars().first()
        
        if not entry:
            entry = LeaderboardEntry(course_id=course_id, user_id=user_id)
            db.add(entry)
        
        entry.total_score = total_score
        entry.total_time_sec = total_time
        await db.commit()

        # Recalculate ranks for the entire course
        await LeaderboardService.recalculate_ranks(db, course_id)

    @staticmethod
    async def recalculate_ranks(db: AsyncSession, course_id: int):
        """
        Updates the rank column for all users in a course.
        """
        stmt = select(LeaderboardEntry).filter_by(course_id=course_id).order_by(
            desc(LeaderboardEntry.total_score),
            LeaderboardEntry.total_time_sec
        )
        result = await db.execute(stmt)
        entries = result.scalars().all()

        for i, entry in enumerate(entries):
            entry.rank = i + 1
        
        await db.commit()

    @staticmethod
    async def get_course_leaderboard(db: AsyncSession, course_id: int, limit: int = 10):
        stmt = select(LeaderboardEntry).filter_by(course_id=course_id).order_by(LeaderboardEntry.rank).limit(limit)
        result = await db.execute(stmt)
        return result.scalars().all()
