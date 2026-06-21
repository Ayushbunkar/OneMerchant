import os
from pydantic import BaseModel

class Settings(BaseModel):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/onemerchant")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    
settings = Settings()
