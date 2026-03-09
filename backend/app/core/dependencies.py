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
