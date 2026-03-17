"""
Rate limiting middleware using slowapi (Redis-backed).

Limits:
  - /auth/login, /auth/register  → 10 req/min  (brute-force protection)
  - Upload endpoints              → 5  req/min  (resource-heavy)
  - Video stream endpoints        → 60 req/min  (player heartbeat)
  - All other authenticated APIs  → 200 req/min
"""
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.config import settings


# Key function: Use user ID from JWT if available, else fall back to IP
def get_rate_limit_key(request) -> str:
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        try:
            from jose import jwt
            token = auth_header[7:]
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            user_id = payload.get("sub")
            if user_id:
                return f"user:{user_id}"
        except Exception:
            pass
    return get_remote_address(request)


# ── Global limiter instance ────────────────────────────────────────────────────
if settings.USE_REDIS:
    # Build the Redis storage URI (uses DB 3)
    _redis_storage_uri = settings.REDIS_URL.rsplit("/", 1)[0] + "/3"
    limiter = Limiter(
        key_func=get_rate_limit_key,
        default_limits=["200/minute"],
        storage_uri=_redis_storage_uri,
    )
else:
    # Fallback to In-Memory storage for local dev without Redis
    from limits.storage import MemoryStorage
    limiter = Limiter(
        key_func=get_rate_limit_key,
        default_limits=["200/minute"],
        storage_uri="memory://",
    )

# ── Reusable limit strings ─────────────────────────────────────────────────────
LIMIT_AUTH = "10/minute"       # Login / register
LIMIT_UPLOAD = "5/minute"      # File / video upload
LIMIT_STREAM = "60/minute"     # Video streaming
LIMIT_DEFAULT = "200/minute"   # General API
