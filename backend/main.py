from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import router as api_router
from app.config import settings
from app.database import Base, SessionLocal, engine
from app.models import Project
from app.seed import seed_database


# Ensure tables exist and auto-seed sample projects if the database is empty on startup
@asynccontextmanager
async def lifespan(_app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Project).count() == 0:
            seed_database()
    finally:
        db.close()
    yield


# Instantiate the FastAPI application with OpenAPI metadata
app = FastAPI(
    title="podia.dev API",
    description="Open-source competitive intelligence archive and discovery engine for hackathon winning projects.",
    version="0.1.0-alpha",
    lifespan=lifespan,
)

# Register CORS middleware supporting comma-separated origins and wildcard Vercel preview domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=settings.CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the v1 REST API router
app.include_router(api_router)
