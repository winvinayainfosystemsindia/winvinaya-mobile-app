from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base


class LeaderboardEntry(Base):
    __tablename__ = "leaderboard_entries"
    __table_args__ = (
        UniqueConstraint("course_id", "user_id", name="uq_course_user_leaderboard"),
    )

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    total_score = Column(Float, default=0.0)        # sum of all quiz scores
    total_time_sec = Column(Integer, default=0)    # seconds spent (tie-breaker)
    rank = Column(Integer, nullable=True)
    
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    course = relationship("Course")
    user = relationship("User")
