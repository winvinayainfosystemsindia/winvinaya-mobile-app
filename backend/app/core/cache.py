"""
Redis caching layer for hot API endpoints.

Usage:
    from app.core.cache import cache, cached, invalidate

    # Cache a value manually
    await cache.set("my_key", data, ttl=300)
    data = await cache.get("my_key")

    # Decorator pattern on a route handler
    @router.get("/courses")
    async def list_courses(...):
        key = f"courses:list:page:{page}:cat:{category}"
        cached = await cache.get(key)
        if cached:
            return cached
        result = await _fetch_courses(...)
        await cache.set(key, result, ttl=300)
        return result

    # Invalidate a namespace
    await cache.delete_pattern("courses:*")
"""
import json
import logging
from typing import Any, Optional
import redis.asyncio as aioredis

from app.core.config import settings

logger = logging.getLogger(__name__)


class RedisCache:
    """Async Redis cache helper with JSON serialisation."""

    def __init__(self):
        self._client: Optional[aioredis.Redis] = None

    async def get_client(self) -> aioredis.Redis:
        if self._client is None:
            cache_url = settings.REDIS_URL.rsplit("/", 1)[0] + f"/{settings.REDIS_CACHE_DB}"
            self._client = aioredis.from_url(
                cache_url,
                encoding="utf-8",
                decode_responses=True,
            )
        return self._client

    async def get(self, key: str) -> Optional[Any]:
        """Return the cached value for `key`, or None on miss/error."""
        try:
            client = await self.get_client()
            raw = await client.get(key)
            if raw is None:
                return None
            return json.loads(raw)
        except Exception as exc:
            logger.warning("Cache GET error for key=%s: %s", key, exc)
            return None

    async def set(self, key: str, value: Any, ttl: int = None) -> bool:
        """Serialise and store `value` under `key` with optional TTL (seconds)."""
        if ttl is None:
            ttl = settings.CACHE_DEFAULT_TTL
        try:
            client = await self.get_client()
            await client.set(key, json.dumps(value, default=str), ex=ttl)
            return True
        except Exception as exc:
            logger.warning("Cache SET error for key=%s: %s", key, exc)
            return False

    async def delete(self, *keys: str) -> int:
        """Delete one or more specific keys."""
        try:
            client = await self.get_client()
            return await client.delete(*keys)
        except Exception as exc:
            logger.warning("Cache DELETE error: %s", exc)
            return 0

    async def delete_pattern(self, pattern: str) -> int:
        """Delete all keys matching a glob pattern (uses SCAN, not KEYS)."""
        try:
            client = await self.get_client()
            deleted = 0
            async for key in client.scan_iter(match=pattern):
                await client.delete(key)
                deleted += 1
            return deleted
        except Exception as exc:
            logger.warning("Cache DELETE PATTERN error for %s: %s", pattern, exc)
            return 0

    async def close(self) -> None:
        if self._client:
            await self._client.aclose()
            self._client = None


# ── Module-level singleton ─────────────────────────────────────────────────────
cache = RedisCache()

# ── TTL constants (seconds) ────────────────────────────────────────────────────
TTL_COURSE_LIST = 300       # 5 min  — public course listing
TTL_COURSE_DETAIL = 600     # 10 min — single course detail
TTL_ADMIN_STATS = 120       # 2 min  — admin dashboard stats
TTL_USER_ME = 1800          # 30 min — current user profile
TTL_ENROLLMENT = 60         # 1 min  — enrollment status (changes often)
