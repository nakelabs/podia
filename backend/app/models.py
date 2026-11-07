import uuid
from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


# Generate a random UUID v4 string for primary keys
def generate_uuid() -> str:
    return str(uuid.uuid4())


# Represent a hackathon event and its metadata in the database
class Hackathon(Base):
    __tablename__ = "hackathons"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    organizer = Column(String(255), nullable=False)
    year = Column(Integer, nullable=False, index=True)
    region = Column(String(100), nullable=False, index=True)
    website_url = Column(String(500), nullable=True)

    projects = relationship("Project", back_populates="hackathon", cascade="all, delete-orphan")


# Represent a winning hackathon project and its competitive intelligence breakdown
class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    hackathon_id = Column(String(36), ForeignKey("hackathons.id"), nullable=False, index=True)
    project_name = Column(String(255), nullable=False, index=True)
    tagline = Column(String(500), nullable=False)
    track = Column(String(100), nullable=False, index=True)
    placement = Column(String(100), nullable=False, index=True)
    problem_statement = Column(Text, nullable=False)
    solution_summary = Column(Text, nullable=False)
    key_differentiator = Column(Text, nullable=False)
    tech_stack = Column(String(500), nullable=False, index=True)
    repo_url = Column(String(500), nullable=True)
    demo_url = Column(String(500), nullable=True)
    pitch_deck_url = Column(String(500), nullable=True)
    video_url = Column(String(500), nullable=True)
    verification_status = Column(String(50), nullable=False, default="unverified", index=True)
    proof_url = Column(String(500), nullable=True)

    hackathon = relationship("Hackathon", back_populates="projects")

