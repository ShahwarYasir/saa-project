# SAA Setup Guide

## Prerequisites

- Node.js 18+ for the React frontend
- PHP 8.1+ for the simple PHP backend
- Git

No Composer, Laravel, or MySQL setup is required for the current backend phase.

## Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The app runs at:

```text
http://localhost:5173
```

Mock mode is enabled by default:

```text
VITE_USE_MOCKS=true
```

## Backend Setup

```bash
cd backend
cp .env.example .env
php -S 127.0.0.1:8000 router.php
```

The API runs at:

```text
http://127.0.0.1:8000/api
```

The backend creates `backend/data/database.json` automatically on first request.

## Connecting Frontend to Backend

Set these values in `frontend/.env`:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_USE_MOCKS=false
```

Restart the frontend dev server after changing `.env`.

## Demo Credentials

- Student: `student@test.com` / `Test@1234`
- Admin: `admin@saa.local` / `Admin@12345`

## Acceptance Testing

Run the SRS acceptance smoke test from the project root:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\srs-acceptance-smoke.ps1
```

Run the frontend production build:

```powershell
cd frontend
npm.cmd run build
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `php` is not recognized | Install PHP or XAMPP and add PHP to PATH |
| CORS errors | Confirm the backend `.env` has `FRONTEND_URL=http://localhost:5173,http://127.0.0.1:5173` |
| Login fails after changing `JWT_SECRET` | Log out in the browser and sign in again |
| Need fresh demo data | Delete `backend/data/database.json`; it will be recreated on the next API request |
