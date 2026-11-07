from app.database import Base, SessionLocal, engine
from app.models import Hackathon, Project


# Define the initial dataset of hackathons and winning projects for local seeding
SEED_DATA = [
    {
        "hackathon": {
            "id": "hack-national-ai-2025",
            "name": "National AI Hackathon",
            "slug": "national-ai-hackathon-2025",
            "organizer": "National AI Research Consortium",
            "year": 2025,
            "region": "North America",
            "website_url": "https://national-ai-hack.example.org",
        },
        "project": {
            "id": "proj-checkmed-001",
            "project_name": "CheckMed",
            "tagline": "Offline-capable multimodal triage and prescription interaction verifier for rural clinics.",
            "track": "Health",
            "placement": "1st Place",
            "problem_statement": "Rural health clinics face severe physician shortages and fragmented patient records, leading to missed adverse drug interactions and delayed triage for high-risk symptoms.",
            "solution_summary": "CheckMed combines a React Native clinician tablet app with a FastAPI inference backend running quantized PyTorch vision and clinical NER models. Clinicians snap a photo of handwritten intake notes or pill bottles, and the pipeline cross-checks dosage conflicts in under 800ms.",
            "key_differentiator": "Instead of wrapping a generic cloud LLM API, the team fine-tuned a compact PyTorch model on FDA drug-interaction tables and demonstrated a live offline fallback mode on a physical tablet with zero Wi-Fi.",
            "tech_stack": "FastAPI, React Native, PyTorch, SQLite, Docker",
            "repo_url": "https://github.com/podia-archive/checkmed",
            "demo_url": "https://checkmed-demo.example.dev",
            "pitch_deck_url": "https://speakerdeck.com/podia-archive/checkmed-national-ai-1st-place",
            "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "verification_status": "platform_verified",
            "proof_url": "https://devpost.com/software/checkmed-ai-triage",
        },
    },
    {
        "hackathon": {
            "id": "hack-isaca-privacy-2025",
            "name": "ISACA Code for Privacy",
            "slug": "isaca-code-for-privacy-2025",
            "organizer": "ISACA Digital Trust Foundation",
            "year": 2025,
            "region": "Europe",
            "website_url": "https://isaca-privacy-hack.example.org",
        },
        "project": {
            "id": "proj-dataghost-002",
            "project_name": "DataGhost",
            "tagline": "Zero-knowledge PII redaction proxy and cryptographic consent receipts for enterprise AI pipelines.",
            "track": "Web3/Privacy",
            "placement": "2nd Place",
            "problem_statement": "Enterprises adopting third-party LLM APIs inadvertently leak customer PII and lack verifiable audit trails when users exercise GDPR right-to-erasure requests.",
            "solution_summary": "DataGhost sits as a FastAPI reverse proxy between internal apps and external LLM providers, stripping sensitive entities into reversible deterministic tokens while anchoring consent and revocation hashes on a lightweight Solidity smart contract.",
            "key_differentiator": "Judges praised the live red-team demo where the team attempted prompt-injection exfiltration against an LLM endpoint and proved that raw SSNs and emails never left the local enclave.",
            "tech_stack": "Next.js, FastAPI, Solidity, Hardhat, TypeScript",
            "repo_url": "https://github.com/podia-archive/dataghost",
            "demo_url": "https://dataghost.example.dev",
            "pitch_deck_url": "https://speakerdeck.com/podia-archive/dataghost-isaca-privacy",
            "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "verification_status": "credential_verified",
            "proof_url": "https://devpost.com/software/dataghost-zk-proxy",
        },
    },
    {
        "hackathon": {
            "id": "hack-global-climate-2025",
            "name": "Global Climate Action Challenge",
            "slug": "global-climate-action-challenge-2025",
            "organizer": "EarthTech Coalition",
            "year": 2025,
            "region": "Global",
            "website_url": "https://climate-action-hack.example.org",
        },
        "project": {
            "id": "proj-agropulse-003",
            "project_name": "AgroPulse",
            "tagline": "Solar-powered LoRaWAN soil telemetry mesh with predictive micro-irrigation scheduling.",
            "track": "Climate Tech",
            "placement": "1st Place",
            "problem_statement": "Smallholder farmers lose up to 40% of irrigation water to evaporation and over-watering because commercial precision-agriculture sensors require expensive cellular subscriptions.",
            "solution_summary": "AgroPulse pairs $14 ESP32/LoRaWAN moisture nodes with a Python telemetry ingestion server and a React geospatial dashboard that computes evapotranspiration forecasts to trigger drip valves automatically.",
            "key_differentiator": "The team brought hardware nodes potted in real soil containers to the judging table and showed live telemetry packets triggering a physical solenoid valve within 2 seconds.",
            "tech_stack": "Python, React, IoT, FastAPI, MQTT",
            "repo_url": "https://github.com/podia-archive/agropulse",
            "demo_url": "https://agropulse.example.dev",
            "pitch_deck_url": "https://speakerdeck.com/podia-archive/agropulse-climate-1st-place",
            "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "verification_status": "platform_verified",
            "proof_url": "https://devpost.com/software/agropulse-iot-mesh",
        },
    },
]


# Create database tables and insert or update the 3 canonical winning projects
def seed_database() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        for entry in SEED_DATA:
            hack_data = entry["hackathon"]
            proj_data = entry["project"]

            hackathon = db.query(Hackathon).filter(Hackathon.slug == hack_data["slug"]).first()
            if not hackathon:
                hackathon = Hackathon(**hack_data)
                db.add(hackathon)
                db.flush()

            existing_project = db.query(Project).filter(Project.id == proj_data["id"]).first()
            if not existing_project:
                project = Project(hackathon_id=hackathon.id, **proj_data)
                db.add(project)

        db.commit()
        print("Seeded podia.dev database with 3 winning hackathon projects.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

