from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base


class LessonDiscussion(Base):
    __tablename__ = "lesson_discussions"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    parent_id = Column(Integer, ForeignKey("lesson_discussions.id"), nullable=True)  # self-referencing for threads
    
    body = Column(Text, nullable=False)
    upvotes = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    lesson = relationship("Lesson")
    user = relationship("User")
    replies = relationship("LessonDiscussion", backref="parent", remote_side=[id])
