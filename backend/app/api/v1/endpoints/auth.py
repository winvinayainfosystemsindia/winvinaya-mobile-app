"""
Auth endpoint — JWT login, token refresh, and logout.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from typing import Optional

from app.db.session import get_db
from app.core.security import (
    verify_password, create_access_token, create_refresh_token, verify_refresh_token
)
from app.core.exceptions import UnauthorizedError
from app.repositories.user import user_repository

router = APIRouter()


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/login", response_model=TokenResponse, summary="Login with email & password")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    """Returns access + refresh tokens on successful authentication."""
    user = await user_repository.get_by_email(db, email=form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise UnauthorizedError("Incorrect email or password.")
    if not user.is_active:
        raise UnauthorizedError("Account is deactivated.")

    extra = {"role": user.role, "email": user.email}
    return TokenResponse(
        access_token=create_access_token(user.id, extra=extra),
        refresh_token=create_refresh_token(user.id),
    )


@router.post("/refresh", response_model=TokenResponse, summary="Refresh access token")
async def refresh_token(
    payload: RefreshRequest,
    db: AsyncSession = Depends(get_db),
):
    user_id = verify_refresh_token(payload.refresh_token)
    if not user_id:
        raise UnauthorizedError("Invalid or expired refresh token.")

    user = await user_repository.get(db, int(user_id))
    if not user or not user.is_active:
        raise UnauthorizedError("User not found.")

    extra = {"role": user.role, "email": user.email}
    return TokenResponse(
        access_token=create_access_token(user.id, extra=extra),
        refresh_token=create_refresh_token(user.id),
    )
