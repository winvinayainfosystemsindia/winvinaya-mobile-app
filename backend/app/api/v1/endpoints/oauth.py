"""
OAuth 2.0 authorization code flow endpoints.

GET  /auth/oauth/{provider}           → redirect to provider consent screen
GET  /auth/oauth/{provider}/callback  → exchange code, create/fetch user, return JWT
"""
from fastapi import APIRouter, Request, Depends, HTTPException, status
from fastapi.responses import RedirectResponse, JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature

from app.core.oauth import oauth, SUPPORTED_PROVIDERS, is_provider_enabled, fetch_user_info
from app.core.security import create_access_token, create_refresh_token
from app.core.config import settings
from app.db.session import get_db
from app.models.user import User, UserRole

router = APIRouter()

# ── State signing (CSRF protection) ───────────────────────────────────────────
_signer = URLSafeTimedSerializer(settings.SHARE_TOKEN_SECRET, salt="oauth-state")


def _make_state(provider: str) -> str:
    return _signer.dumps({"provider": provider})


def _verify_state(state: str, provider: str, max_age: int = 600) -> bool:
    try:
        data = _signer.loads(state, max_age=max_age)
        return data.get("provider") == provider
    except (SignatureExpired, BadSignature):
        return False


# ── Helper: get or create the user record ─────────────────────────────────────
async def _get_or_create_oauth_user(
    db: AsyncSession,
    provider: str,
    provider_user_id: str,
    email: str,
    name: str,
    avatar_url: str | None,
) -> User:
    """
    1. Look up user by oauth_provider + oauth_provider_id (returning user)
    2. Fall back to email match (link accounts)
    3. Create new user if neither matches
    """
    # Look up by provider ID
    result = await db.execute(
        select(User).where(
            User.oauth_provider == provider,
            User.oauth_provider_id == provider_user_id,
        )
    )
    user = result.scalar_one_or_none()
    if user:
        return user

    # Try to link by email
    if email:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if user:
            user.oauth_provider = provider
            user.oauth_provider_id = provider_user_id
            if avatar_url and not user.avatar_url:
                user.avatar_url = avatar_url
            await db.commit()
            await db.refresh(user)
            return user

    # Create new OAuth user (password-less)
    user = User(
        email=email or f"{provider}_{provider_user_id}@oauth.local",
        full_name=name or "OAuth User",
        hashed_password="",           # No local password; only OAuth flow
        is_active=True,
        is_verified=True,             # Trusted — provider verified the email
        role=UserRole.learner,
        oauth_provider=provider,
        oauth_provider_id=provider_user_id,
        avatar_url=avatar_url,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


# ── Routes ─────────────────────────────────────────────────────────────────────

@router.get("/{provider}", summary="Initiate OAuth login")
async def oauth_initiate(provider: str, request: Request):
    """Redirect the browser to the OAuth provider's consent screen."""
    if provider not in SUPPORTED_PROVIDERS:
        raise HTTPException(status_code=400, detail=f"Unsupported provider: {provider}")
    if not is_provider_enabled(provider):
        raise HTTPException(status_code=400, detail=f"Provider '{provider}' is not configured.")

    callback_url = f"{settings.OAUTH_REDIRECT_BASE}{settings.API_V1_PREFIX}/auth/oauth/{provider}/callback"
    state = _make_state(provider)
    client = getattr(oauth, provider)
    return await client.authorize_redirect(request, callback_url, state=state)


@router.get("/{provider}/callback", summary="OAuth callback — returns JWT tokens")
async def oauth_callback(
    provider: str,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Receives the authorization callback from the provider.
    Creates or fetches the user and returns JWT access + refresh tokens
    as JSON (the frontend stores them and proceeds normally).
    """
    if provider not in SUPPORTED_PROVIDERS:
        raise HTTPException(status_code=400, detail=f"Unsupported provider: {provider}")
    if not is_provider_enabled(provider):
        raise HTTPException(status_code=400, detail=f"Provider '{provider}' is not configured.")

    # Verify CSRF state
    state = request.query_params.get("state", "")
    if not _verify_state(state, provider):
        raise HTTPException(status_code=400, detail="Invalid OAuth state. Possible CSRF.")

    try:
        client = getattr(oauth, provider)
        token = await client.authorize_access_token(request)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"OAuth token exchange failed: {exc}")

    # Fetch normalised user info from provider
    user_info = await fetch_user_info(provider, token)

    user = await _get_or_create_oauth_user(
        db=db,
        provider=provider,
        provider_user_id=user_info["sub"],
        email=user_info["email"],
        name=user_info["name"],
        avatar_url=user_info.get("avatar_url"),
    )

    extra = {"role": user.role, "email": user.email}
    access_token = create_access_token(user.id, extra=extra)
    refresh_token = create_refresh_token(user.id)

    return JSONResponse({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "avatar_url": user.avatar_url,
        },
    })
