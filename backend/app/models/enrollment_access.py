from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.models.base import Base


class UserCourseAccess(Base):
    """
    Per-user course access override. 
    This allows setting a specific expiry date for an individual user that 
    differs from the default course enrollment period.
    """
    __tablename__ = "user_course_access"
    __table_args__ = (
        UniqueConstraint("user_id", "course_id", name="uq_user_course_access"),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    
    expiry_date = Column(DateTime(timezone=True), nullable=False)
    granted_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", foreign_keys=[user_id])
    course = relationship("Course")
    granter = relationship("User", foreign_keys=[granted_by])
