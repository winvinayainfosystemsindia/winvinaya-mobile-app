from sqlalchemy import Column, Integer, ForeignKey, Text, SmallInteger, UniqueConstraint, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base


class CourseRating(Base):
    __tablename__ = "course_ratings"
    __table_args__ = (
        UniqueConstraint("course_id", "user_id", name="uq_course_user_rating"),
    )

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    rating = Column(SmallInteger, nullable=False)  # 1-5
    review = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    course = relationship("Course")
    user = relationship("User")
