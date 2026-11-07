from app.database import Base, SessionLocal, engine
from app.models import Hackathon, Project

# Legacy demo IDs to purge from local or production databases
DEMO_PROJECT_IDS = [
    "proj-checkmed-001",
    "proj-dataghost-002",
    "proj-agropulse-003",
]

DEMO_HACKATHON_IDS = [
    "hack-national-ai-2025",
    "hack-isaca-privacy-2025",
    "hack-global-climate-2025",
]


# Ensure database tables exist and remove any previously seeded demo records
def purge_demo_data() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        db.query(Project).filter(Project.id.in_(DEMO_PROJECT_IDS)).delete(synchronize_session=False)
        db.query(Hackathon).filter(Hackathon.id.in_(DEMO_HACKATHON_IDS)).delete(
            synchronize_session=False
        )
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    purge_demo_data()
    print("Initialized schema and purged all demo records.")
