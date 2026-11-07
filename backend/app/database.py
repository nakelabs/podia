from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import normalize_postgres_driver_url, settings


# Build a resilient SQLAlchemy engine for local SQLite or serverless Neon PostgreSQL
def build_engine(raw_database_url: str) -> Engine:
    # Ensure postgres:// and bare postgresql:// URLs explicitly target postgresql+psycopg2://
    database_url = normalize_postgres_driver_url(raw_database_url)

    # Configure single-thread bypass when running against local SQLite
    if database_url.startswith("sqlite"):
        return create_engine(
            database_url,
            connect_args={"check_same_thread": False},
        )

    # Enforce SSL for remote Neon PostgreSQL connections when sslmode is not already in the URL
    is_local_pg = "localhost" in database_url or "127.0.0.1" in database_url
    connect_args = {}
    if not is_local_pg and "sslmode=" not in database_url:
        connect_args["sslmode"] = "require"

    # Configure pre-ping and connection pool recycling for serverless Neon compute scale-to-zero
    return create_engine(
        database_url,
        connect_args=connect_args,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
        pool_recycle=300,
    )


# Instantiate the global SQLAlchemy engine
engine = build_engine(settings.DATABASE_URL)

# Create a configured SessionLocal factory for request-scoped database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Define the declarative base class for all ORM models
Base = declarative_base()


# Yield a database session per request and ensure reliable closure in a finally block
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
