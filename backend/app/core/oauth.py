"""
OAuth 2.0 / SSO integration using Authlib.

Supported providers: Google, Microsoft (Azure AD), GitHub.
Flow: Authorization Code with PKCE.

Usage:
    GET /api/v1/auth/oauth/{provider}           → redirect to provider
    GET /api/v1/auth/oauth/{provider}/callback  → exchange code for JWT
"""
import secrets
from typing import Optional, Dict, Any

from authlib.integrations.starlette_client import OAuth, OAuthError
from starlette.config import Config

from app.core.config import settings


# ── Build Authlib config from Settings ──────────────────────────────────────
_conf = Config()

oauth = OAuth()

# ── Google ──────────────────────────────────────────────────────────────────
if settings.GOOGLE_CLIENT_ID and settings.GOOGLE_CLIENT_SECRET:
    oauth.register(
        name="google",
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
        client_kwargs={"scope": "openid email profile"},
    )

# ── Microsoft Azure AD ────────────────────────────────────────────────────────
if settings.AZURE_CLIENT_ID and settings.AZURE_CLIENT_SECRET:
    tenant = settings.AZURE_TENANT_ID or "common"
    oauth.register(
        name="microsoft",
        client_id=settings.AZURE_CLIENT_ID,
        client_secret=settings.AZURE_CLIENT_SECRET,
        server_metadata_url=f"https://login.microsoftonline.com/{tenant}/v2.0/.well-known/openid-configuration",
        client_kwargs={"scope": "openid email profile"},
    )

# ── GitHub ────────────────────────────────────────────────────────────────────
if settings.GITHUB_CLIENT_ID and settings.GITHUB_CLIENT_SECRET:
    oauth.register(
        name="github",
        client_id=settings.GITHUB_CLIENT_ID,
        client_secret=settings.GITHUB_CLIENT_SECRET,
        access_token_url="https://github.com/login/oauth/access_token",
        access_token_params=None,
        authorize_url="https://github.com/login/oauth/authorize",
        authorize_params=None,
        api_base_url="https://api.github.com/",
        client_kwargs={"scope": "read:user user:email"},
    )


SUPPORTED_PROVIDERS = {"google", "microsoft", "github"}


def is_provider_enabled(provider: str) -> bool:
    return hasattr(oauth, provider) and getattr(oauth, provider, None) is not None


async def fetch_user_info(provider: str, token: dict) -> Dict[str, Any]:
    """
    Normalise provider-specific user info into a common dict:
    { sub, email, name, avatar_url, provider }
    """
    client = getattr(oauth, provider)

    if provider == "google":
        resp = await client.get("https://www.googleapis.com/oauth2/v3/userinfo", token=token)
        data = resp.json()
        return {
            "sub": data.get("sub"),
            "email": data.get("email", ""),
            "name": data.get("name", ""),
            "avatar_url": data.get("picture"),
            "provider": "google",
        }

    elif provider == "microsoft":
        resp = await client.get("https://graph.microsoft.com/v1.0/me", token=token)
        data = resp.json()
        return {
            "sub": data.get("id"),
            "email": data.get("mail") or data.get("userPrincipalName", ""),
            "name": data.get("displayName", ""),
            "avatar_url": None,
            "provider": "microsoft",
        }

    elif provider == "github":
        resp = await client.get("user", token=token)
        data = resp.json()
        # GitHub may not expose email in basic profile
        email = data.get("email") or ""
        if not email:
            email_resp = await client.get("user/emails", token=token)
            emails = email_resp.json()
            primary = next((e for e in emails if e.get("primary") and e.get("verified")), None)
            email = primary["email"] if primary else ""
        return {
            "sub": str(data.get("id")),
            "email": email,
            "name": data.get("name") or data.get("login", ""),
            "avatar_url": data.get("avatar_url"),
            "provider": "github",
        }

    raise ValueError(f"Unknown provider: {provider}")
