# SAA Backend - Simple PHP API

This backend is a framework-free PHP API for the Study Abroad Assistant React frontend. It replaces the earlier Laravel handoff while keeping the same `/api/...` routes and JSON response shapes.

## Requirements

- PHP 8.1+ recommended
- No Composer packages required
- No MySQL required for the demo build

The API stores demo data in `backend/data/database.json`, which is generated automatically on the first request.

## Backend Status

Complete for the current SRS/demo phase. The backend covers auth, student flows, recommendations, shortlist, guide, roadmap, templates, writing assistant fallback, and admin CRUD.

Acceptance command:

```powershell
powershell -ExecutionPolicy Bypass -File ..\scripts\srs-acceptance-smoke.ps1
```

## Run Locally

```bash
cd backend
copy .env.example .env
php -S 127.0.0.1:8000 router.php
```

API base URL:

```text
http://127.0.0.1:8000/api
```

Frontend integration:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_USE_MOCKS=false
```

## Demo Credentials

- Student: `student@test.com` / `Test@1234`
- Admin: `admin@saa.local` / `Admin@12345`

## Implemented Areas

- Student/admin login with HMAC JWT-style bearer tokens
- Student registration, profile, dashboard, recommendations, shortlist, guides, roadmap, templates, and writing assistant
- Admin dashboard, university CRUD, scholarship CRUD, and student status/delete actions
- CORS for the Vite dev server

## Notes

This is intentionally simple PHP for semester/demo use. For production, move persistence to MySQL/PDO, rotate `JWT_SECRET`, and disable debug error details.
