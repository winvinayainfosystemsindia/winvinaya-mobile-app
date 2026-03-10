"""
Auth endpoint — JWT login, token refresh, and logout.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
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


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/login", response_model=TokenResponse, summary="Login with email & password")
async def login(
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Returns access + refresh tokens on successful authentication.
    Supports both JSON body and application/x-www-form-urlencoded.
    """
    content_type = request.headers.get("content-type", "")
    email = None
    password = None

    if "application/json" in content_type:
        try:
            data = await request.json()
            email = data.get("email") or data.get("username")
            password = data.get("password")
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid JSON body")
    else:
        # Fallback to form data (useful for Swagger UI and older clients)
        try:
            form = await request.form()
            email = form.get("username") or form.get("email")
            password = form.get("password")
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid form data")

    if not email or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email and password are required."
        )

    user = await user_repository.get_by_email(db, email=email)
    if not user or not verify_password(password, user.hashed_password):
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
