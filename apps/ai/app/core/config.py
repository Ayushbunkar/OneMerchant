"""
Application configuration loaded from environment variables.

Uses pydantic-settings to provide typed, validated configuration with
sensible defaults.  A single ``Settings`` instance is created at import
time and re-used across the application via ``get_settings()``.
"""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central configuration sourced from environment / ``.env`` file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # ── Database ────────────────────────────────────────────────
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/onemerchant"

    # ── Redis ───────────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379/1"

    # ── OpenAI ──────────────────────────────────────────────────
    OPENAI_API_KEY: str = ""
    AI_MODEL: str = "gpt-4o-mini"

    # ── Server ──────────────────────────────────────────────────
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = False

    # ── App metadata ────────────────────────────────────────────
    APP_TITLE: str = "OneMerchant AI Service"
    APP_VERSION: str = "1.0.0"

    @property
    def openai_available(self) -> bool:
        """Return ``True`` when a non-empty OpenAI key has been configured."""
        return bool(self.OPENAI_API_KEY and self.OPENAI_API_KEY != "sk-your-openai-api-key-here")


@lru_cache
def get_settings() -> Settings:
    """Return the cached application settings singleton."""
    return Settings()
