# Study Abroad Assistant (SAA)

An AI-powered university and scholarship guidance platform for students seeking international education opportunities.

## Team

| Role | Name | Branch |
|------|------|--------|
| Frontend Developer | Dur-e-Shahwar | `frontend/person1` |
| Backend Developer | Hasana Zahid | `backend/person2` |

## Tech Stack

### Frontend
- React 19 + Vite 8
- Bootstrap 5.3.8
- React Router 7
- react-hook-form + yup

### Backend
- Simple PHP 8.x API
- JSON file persistence for demo data
- HMAC JWT-style bearer authentication

## Current Status

Backend phase is complete and ready for frontend integration. The simple PHP API implements the agreed SRS/API scope and has passed the SRS acceptance smoke test.

Frontend final polishing and presentation screenshots are pending with the frontend developer.

## Getting Started

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
# App runs at http://localhost:5173
```

### Backend
```bash
cd backend
cp .env.example .env
php -S 127.0.0.1:8000 router.php
# API runs at http://127.0.0.1:8000
```

On this machine you can also use:

```bash
cd backend
start-server.bat
```

## Project Structure

```text
saa-project/
|-- docs/          # API contract, component map, setup guide
|-- backend/       # Simple PHP API (Person 2)
`-- frontend/      # React SPA (Person 1)
```

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `frontend/person1` | Frontend development |
| `backend/person2` | Backend development |
| `integration/v1` | Integration testing |

## Mock Mode

The frontend runs in mock mode by default (`VITE_USE_MOCKS=true`). All pages are fully functional with realistic mock data, no backend needed.

For integrated testing and final demo, use real API mode:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_USE_MOCKS=false
```

## Acceptance Test

Run the SRS smoke test with:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\srs-acceptance-smoke.ps1
```

See `docs/srs-acceptance-report.md` and `docs/final-presentation-checklist.md`.

### Test Credentials
- **Student**: `student@test.com` / `Test@1234`
- **Admin**: `admin@saa.local` / `Admin@12345`

## License

This project is part of an academic semester project.
