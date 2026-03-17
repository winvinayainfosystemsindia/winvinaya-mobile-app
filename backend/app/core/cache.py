"""
Redis caching layer for hot API endpoints.
Fallback to In-Memory cache if Redis is disabled (USE_REDIS=False).
"""
import json
import logging
from typing import Any, Optional, Dict, Tuple
import time
import redis.asyncio as aioredis

from app.core.config import settings

logger = logging.getLogger(__name__)


class RedisCache:
    """Async Redis cache helper with JSON serialisation."""

    def __init__(self):
        self._client: Optional[aioredis.Redis] = None
        # Simple in-memory fallback for Windows local dev without Redis
        self._memory_cache: Dict[str, Tuple[str, float]] = {}

    async def get_client(self) -> Optional[aioredis.Redis]:
        if not settings.USE_REDIS:
            return None
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
        if not settings.USE_REDIS:
            item = self._memory_cache.get(key)
            if item:
                val, expiry = item
                if expiry > time.time():
                    return json.loads(val)
                else:
                    del self._memory_cache[key]
            return None

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
        
        if not settings.USE_REDIS:
            self._memory_cache[key] = (json.dumps(value, default=str), time.time() + ttl)
            # Basic cleanup: if cache too large, clear it (simplest way for dev)
            if len(self._memory_cache) > 1000:
                self._memory_cache.clear()
            return True

        try:
            client = await self.get_client()
            await client.set(key, json.dumps(value, default=str), ex=ttl)
            return True
        except Exception as exc:
            logger.warning("Cache SET error for key=%s: %s", key, exc)
            return False

    async def delete(self, *keys: str) -> int:
        """Delete one or more specific keys."""
        if not settings.USE_REDIS:
            deleted = 0
            for key in keys:
                if key in self._memory_cache:
                    del self._memory_cache[key]
                    deleted += 1
            return deleted

        try:
            client = await self.get_client()
            return await client.delete(*keys)
        except Exception as exc:
            logger.warning("Cache DELETE error: %s", exc)
            return 0

    async def delete_pattern(self, pattern: str) -> int:
        """Delete all keys matching a glob pattern."""
        if not settings.USE_REDIS:
            import fnmatch
            deleted = 0
            keys_to_del = [k for k in self._memory_cache.keys() if fnmatch.fnmatch(k, pattern)]
            for k in keys_to_del:
                del self._memory_cache[k]
                deleted += 1
            return deleted

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
        self._memory_cache.clear()


# ── Module-level singleton ─────────────────────────────────────────────────────
cache = RedisCache()

# ── TTL constants (seconds) ────────────────────────────────────────────────────
TTL_COURSE_LIST = 300
TTL_COURSE_DETAIL = 600
TTL_ADMIN_STATS = 120
TTL_USER_ME = 1800
TTL_ENROLLMENT = 60
