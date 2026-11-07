from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import router as api_router
from app.config import settings
from app.database import Base, engine
from app.seed import purge_demo_data


# Create database tables on startup and remove any legacy demo records
@asynccontextmanager
async def lifespan(_app: FastAPI):
    Base.metadata.create_all(bind=engine)
    purge_demo_data()
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
