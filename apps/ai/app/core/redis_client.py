"""
Redis connection singleton and cache helper functions.

Provides ``get_cached`` / ``set_cached`` / ``invalidate`` wrappers that
serialise values as JSON and handle connection errors gracefully so that
callers never crash when Redis is temporarily unreachable.
"""

import json
import logging
from typing import Any, Optional

import redis.asyncio as aioredis

from app.core.config import get_settings

logger = logging.getLogger(__name__)

_settings = get_settings()

# Global async Redis client (initialised lazily)
_redis_client: Optional[aioredis.Redis] = None


async def get_redis() -> aioredis.Redis:
    """Return (and lazily create) the global async Redis client."""
    global _redis_client
    if _redis_client is None:
        _redis_client = aioredis.from_url(
            _settings.REDIS_URL,
            decode_responses=True,
            socket_connect_timeout=5,
        )
        logger.info("Redis client created for %s", _settings.REDIS_URL)
    return _redis_client


async def close_redis() -> None:
    """Close the global Redis connection if it exists."""
    global _redis_client
    if _redis_client is not None:
        await _redis_client.close()
        _redis_client = None
        logger.info("Redis connection closed")


async def check_redis_connection() -> bool:
    """Return ``True`` if Redis is reachable."""
    try:
        client = await get_redis()
        await client.ping()
        return True
    except Exception as exc:
        logger.warning("Redis health-check failed: %s", exc)
        return False


# ── Cache helpers ───────────────────────────────────────────────


async def get_cached(key: str) -> Optional[Any]:
    """
    Retrieve a JSON-deserialised value from Redis.

    Returns ``None`` when the key does not exist **or** when Redis is
    unreachable (fail-open caching).
    """
    try:
        client = await get_redis()
        raw = await client.get(key)
        if raw is None:
            return None
        return json.loads(raw)
    except Exception as exc:
        logger.warning("Cache GET failed for key=%s: %s", key, exc)
        return None


async def set_cached(key: str, value: Any, ttl_seconds: int = 300) -> bool:
    """
    Store a JSON-serialised value in Redis with an expiry.

    Returns ``True`` on success, ``False`` on failure (fail-open).
    """
    try:
        client = await get_redis()
        await client.set(key, json.dumps(value, default=str), ex=ttl_seconds)
        return True
    except Exception as exc:
        logger.warning("Cache SET failed for key=%s: %s", key, exc)
        return False


async def invalidate(pattern: str) -> int:
    """
    Delete all keys matching *pattern* (e.g. ``"ai:tenant:xyz:*"``).

    Returns the number of deleted keys, or ``0`` on failure.
    """
    try:
        client = await get_redis()
        keys: list[str] = []
        async for key in client.scan_iter(match=pattern, count=200):
            keys.append(key)
        if keys:
            deleted: int = await client.delete(*keys)
            logger.info("Invalidated %d keys matching '%s'", deleted, pattern)
            return deleted
        return 0
    except Exception as exc:
        logger.warning("Cache INVALIDATE failed for pattern=%s: %s", pattern, exc)
        return 0
