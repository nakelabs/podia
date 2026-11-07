# podia.dev

Open-source archive of winning hackathon projects. Explore how 1st, 2nd, and 3rd place builds were architected, pitched, and judged.

## Quick Start

```bash
# 1. Install dependencies
npm install
pip install -r backend/requirements.txt
cd frontend && npm install && cd ..

# 2. Seed sample projects
npm run seed

# 3. Run backend (port 8000) + frontend (port 5173)
npm run dev
```

- **Web App**: `http://localhost:5173`
- **API Docs**: `http://localhost:8000/docs`
- **Health Check**: `http://localhost:8000/api/v1/health`

*(Uses local SQLite by default. Set `DATABASE_URL` in `backend/.env` to connect to Neon / PostgreSQL.)*

## Contributing

We welcome contributions from builders, hackathon winners, and organizers!

### 1. Submit a Winning Project
- **In the App**: Click **Submit a Win** in the header.
- **Via Pull Request**: Use [`data/sample-project.json`](./data/sample-project.json) as a template and include a public proof link (Devpost, official announcement, or repository).

### 2. Contribute Code
1. Fork the repository and create a branch (`git checkout -b feat/your-feature`).
2. Make your changes in `frontend/` (React + TypeScript + Tailwind) or `backend/` (FastAPI + SQLAlchemy).
3. Test locally with `npm run dev` and open a Pull Request.

## Project Structure

```text
podia.dev/
├── backend/       # FastAPI + SQLAlchemy API (SQLite & Neon PostgreSQL)
├── frontend/      # React + Vite + Tailwind UI (with offline mock fallback)
└── data/          # Sample JSON schema for project submissions
```

## License

MIT
