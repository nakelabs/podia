import json
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


# Rewrite postgres:// or bare postgresql:// schemes to explicitly use the psycopg2 driver
def normalize_postgres_driver_url(value: str) -> str:
    if not isinstance(value, str) or not value.strip():
        return "sqlite:///./podia.db"
    url = value.strip()
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+psycopg2://", 1)
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+psycopg2://", 1)
    return url


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

    # Normalize Render and Neon Postgres connection strings to postgresql+psycopg2://
    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def validate_database_url(cls, value: str) -> str:
        return normalize_postgres_driver_url(value)

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
