from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import verify_access_token
from app.core.exceptions import UnauthorizedError, PermissionDeniedError
from app.db.session import get_db

bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
):
    """Dependency: validate Bearer token and return the current User ORM object."""
    from app.repositories.user import user_repository

    if not credentials or not credentials.credentials:
        raise UnauthorizedError()

    user_id = verify_access_token(credentials.credentials)
    if not user_id:
        raise UnauthorizedError()

    user = await user_repository.get(db, int(user_id))
    if not user or not user.is_active:
        raise UnauthorizedError(detail="User not found or deactivated.")

    return user


def require_role(*roles: str):
    """
    Dependency factory — restricts endpoint to users with specific roles.
    Usage: Depends(require_role("admin", "instructor"))
    """

    async def _check_role(current_user=Depends(get_current_user)):
        if current_user.role not in roles:
            raise PermissionDeniedError(
                f"This action requires one of these roles: {', '.join(roles)}"
            )
        return current_user

    return _check_role


# ─── Convenience shorthands ──────────────────────────────────────────────────

def get_current_admin(current_user=Depends(require_role("admin"))):
    return current_user


def get_current_instructor(
    current_user=Depends(require_role("admin", "instructor"))
):
    return current_user


from datetime import datetime
from app.models.enrollment import Enrollment, EnrollmentStatus

async def can_access_course(
    course_id: int,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    Dependency: Verify if the current user has active, non-expired access to a course.
    Checks Enrollment status and expiry, then checks UserCourseAccess override.
    """
    from app.repositories.enrollment import enrollment_repository
    from app.repositories.enrollment_access import user_course_access_repository
    
    # 1. Check for active enrollment
    enrollment = await enrollment_repository.get_by_user_and_course(db, current_user.id, course_id)
    if not enrollment or enrollment.status == EnrollmentStatus.dropped:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not enrolled in this course."
        )
    
    # 2. Check for per-user access override first (highest priority)
    override = await user_course_access_repository.get_by_user_and_course(db, current_user.id, course_id)
    expiry = None
    
    if override:
        expiry = override.expiry_date
    elif enrollment.expiry_date:
        expiry = enrollment.expiry_date
        
    # 3. Enforce expiry
    if expiry and expiry < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your access to this course has expired."
        )
        
    return enrollment
