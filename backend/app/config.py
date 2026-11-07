import json
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


# Define application environment settings, Neon URL normalization, and CORS origins
class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./podia.db"
    CORS_ORIGINS: list[str] | str = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "https://*.vercel.app",
    ]
    CORS_ORIGIN_REGEX: str = r"^https://.*\.vercel\.app$"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Normalize legacy postgres:// scheme to postgresql:// for SQLAlchemy 2.0 compatibility on Render/Neon
    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def normalize_database_url(cls, value: str) -> str:
        if isinstance(value, str) and value.strip().startswith("postgres://"):
            return value.strip().replace("postgres://", "postgresql://", 1)
        return value.strip() if isinstance(value, str) else "sqlite:///./podia.db"

    # Parse comma-separated or JSON-formatted CORS_ORIGINS from environment variables
    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, list):
            return [origin.strip() for origin in value if origin.strip()]
        if isinstance(value, str):
            raw = value.strip()
            if raw.startswith("["):
                try:
                    parsed = json.loads(raw)
                    if isinstance(parsed, list):
                        return [str(origin).strip() for origin in parsed if str(origin).strip()]
                except json.JSONDecodeError:
                    pass
            return [origin.strip() for origin in raw.split(",") if origin.strip()]
        return ["http://localhost:5173", "http://127.0.0.1:5173", "https://*.vercel.app"]


# Instantiate global settings singleton for imports across the backend
settings = Settings()
