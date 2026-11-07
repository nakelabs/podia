import re
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.responses import JSONResponse
from sqlalchemy import or_, text
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models import Hackathon, Project
from app.schemas import HackathonResponse, ProjectCreate, ProjectResponse

router = APIRouter(prefix="/api/v1", tags=["podia"])


# Normalize a string into a URL-safe slug for new hackathon records
def slugify(text: str) -> str:
    clean = re.sub(r"[^a-zA-Z0-9\s-]", "", text.lower()).strip()
    return re.sub(r"[\s_-]+", "-", clean)


# Convert a list or comma string of technologies into a canonical comma-separated string
def serialize_tech_stack(stack: list[str] | str) -> str:
    if isinstance(stack, list):
        return ", ".join(item.strip() for item in stack if item.strip())
    return ", ".join(item.strip() for item in stack.split(",") if item.strip())


# Execute a lightweight SELECT 1 query to verify database connectivity and pool health
@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "service": "podia-api",
            "database": "connected",
        }
    except Exception:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unhealthy",
                "service": "podia-api",
                "database": "disconnected",
            },
        )


# Fetch projects matching search text, track, placement, region, and tech stack filters
@router.get("/projects", response_model=list[ProjectResponse])
def list_projects(
    q: Optional[str] = Query(default=None, description="Keyword search across name, problem, solution, or stack"),
    track: Optional[str] = Query(default=None, description="Filter by project track"),
    placement: Optional[str] = Query(default=None, description="Filter by placement (e.g., 1st Place)"),
    region: Optional[str] = Query(default=None, description="Filter by hackathon region"),
    tech_stack: Optional[str] = Query(default=None, description="Filter by technology tag"),
    db: Session = Depends(get_db),
):
    query = db.query(Project).options(joinedload(Project.hackathon)).join(Hackathon)

    if q and q.strip():
        pattern = f"%{q.strip()}%"
        query = query.filter(
            or_(
                Project.project_name.ilike(pattern),
                Project.tagline.ilike(pattern),
                Project.problem_statement.ilike(pattern),
                Project.solution_summary.ilike(pattern),
                Project.key_differentiator.ilike(pattern),
                Project.tech_stack.ilike(pattern),
                Hackathon.name.ilike(pattern),
            )
        )

    if track and track.lower() != "all":
        query = query.filter(Project.track.ilike(f"%{track.strip()}%"))

    if placement and placement.lower() != "all":
        query = query.filter(Project.placement.ilike(f"%{placement.strip()}%"))

    if region and region.lower() != "all":
        query = query.filter(Hackathon.region.ilike(f"%{region.strip()}%"))

    if tech_stack and tech_stack.lower() != "all":
        query = query.filter(Project.tech_stack.ilike(f"%{tech_stack.strip()}%"))

    return query.order_by(Hackathon.year.desc(), Project.project_name.asc()).all()


# Retrieve a single winning project by its ID with nested hackathon details
@router.get("/projects/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str, db: Session = Depends(get_db)):
    project = (
        db.query(Project)
        .options(joinedload(Project.hackathon))
        .filter(Project.id == project_id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return project


# Accept a new community project submission and default verification status to unverified
@router.post("/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    hackathon = None
    if payload.hackathon_id:
        hackathon = db.query(Hackathon).filter(Hackathon.id == payload.hackathon_id).first()

    if not hackathon:
        hackathon_name = (payload.hackathon_name or "Community Submitted Hackathon").strip()
        base_slug = slugify(f"{hackathon_name}-{payload.hackathon_year or 2026}")
        hackathon = db.query(Hackathon).filter(Hackathon.slug == base_slug).first()
        if not hackathon:
            hackathon = Hackathon(
                name=hackathon_name,
                slug=base_slug,
                organizer=(payload.hackathon_organizer or "Community").strip(),
                year=payload.hackathon_year or 2026,
                region=(payload.hackathon_region or "Global").strip(),
                website_url=payload.hackathon_website_url,
            )
            db.add(hackathon)
            db.flush()

    new_project = Project(
        hackathon_id=hackathon.id,
        project_name=payload.project_name.strip(),
        tagline=payload.tagline.strip(),
        track=payload.track.strip(),
        placement=payload.placement.strip(),
        problem_statement=payload.problem_statement.strip(),
        solution_summary=payload.solution_summary.strip(),
        key_differentiator=payload.key_differentiator.strip(),
        tech_stack=serialize_tech_stack(payload.tech_stack),
        repo_url=payload.repo_url,
        demo_url=payload.demo_url,
        pitch_deck_url=payload.pitch_deck_url,
        video_url=payload.video_url,
        verification_status="unverified",
        proof_url=payload.proof_url,
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project


# List all indexed hackathons ordered by most recent year first
@router.get("/hackathons", response_model=list[HackathonResponse])
def list_hackathons(db: Session = Depends(get_db)):
    return db.query(Hackathon).order_by(Hackathon.year.desc(), Hackathon.name.asc()).all()
