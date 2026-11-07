from typing import Optional
from pydantic import BaseModel, ConfigDict, field_validator


# Serialize hackathon event metadata for API responses
class HackathonResponse(BaseModel):
    id: str
    name: str
    slug: str
    organizer: str
    year: int
    region: str
    website_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


# Define shared project attributes across creation and response schemas
class ProjectBase(BaseModel):
    project_name: str
    tagline: str
    track: str
    placement: str
    problem_statement: str
    solution_summary: str
    key_differentiator: str
    tech_stack: list[str] | str
    repo_url: Optional[str] = None
    demo_url: Optional[str] = None
    pitch_deck_url: Optional[str] = None
    video_url: Optional[str] = None
    proof_url: Optional[str] = None


# Validate incoming payload when submitting a new winning project
class ProjectCreate(ProjectBase):
    hackathon_id: Optional[str] = None
    hackathon_name: Optional[str] = "Community Submitted Hackathon"
    hackathon_organizer: Optional[str] = "Community"
    hackathon_year: Optional[int] = 2026
    hackathon_region: Optional[str] = "Global"
    hackathon_website_url: Optional[str] = None


# Format project records with normalized tech stack list and nested hackathon details
class ProjectResponse(BaseModel):
    id: str
    hackathon_id: str
    project_name: str
    tagline: str
    track: str
    placement: str
    problem_statement: str
    solution_summary: str
    key_differentiator: str
    tech_stack: list[str]
    repo_url: Optional[str] = None
    demo_url: Optional[str] = None
    pitch_deck_url: Optional[str] = None
    video_url: Optional[str] = None
    verification_status: str
    proof_url: Optional[str] = None
    hackathon: Optional[HackathonResponse] = None

    model_config = ConfigDict(from_attributes=True)

    # Convert comma-delimited database string into a clean list of stack tags
    @field_validator("tech_stack", mode="before")
    @classmethod
    def parse_tech_stack(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, list):
            return [item.strip() for item in value if item.strip()]
        if isinstance(value, str):
            return [item.strip() for item in value.split(",") if item.strip()]
        return []

