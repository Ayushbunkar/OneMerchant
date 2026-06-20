"""
SQLAlchemy database engine, session factory, and FastAPI dependency.

Provides **read-only** access to the same PostgreSQL database used by the
Node.js backend.  The Prisma table / column naming conventions (snake_case
``@@map`` names) are used directly in raw SQL queries throughout the AI
service — no ORM models are declared here.
"""

import logging
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import get_settings

logger = logging.getLogger(__name__)

_settings = get_settings()

# Convert the standard postgres:// URL to the async driver URL
_async_url = _settings.DATABASE_URL.replace(
    "postgresql://", "postgresql+asyncpg://"
).replace("postgres://", "postgresql+asyncpg://")

engine = create_async_engine(
    _async_url,
    echo=_settings.DEBUG,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
)

async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency that yields an async database session."""
    async with async_session_factory() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def check_db_connection() -> bool:
    """Return ``True`` if the database is reachable."""
    try:
        async with async_session_factory() as session:
            from sqlalchemy import text
            await session.execute(text("SELECT 1"))
        return True
    except Exception as exc:
        logger.warning("Database health-check failed: %s", exc)
        return False


async def dispose_engine() -> None:
    """Gracefully close all pooled connections."""
    await engine.dispose()
    logger.info("Database engine disposed")
