# Backend Handoff Summary

<<<<<<< HEAD
**From:** Dur-e-Shahwar(Frontend Developer)  
**To:** Hasana Zahid (Backend Developer)  
=======
**From:** Hasana Zahid / Backend Phase  
**To:** Frontend Developer / Integration Phase  
>>>>>>> df4db1e (Complete simple PHP backend handoff)
**Date:** May 2026

---

## Backend Status

The backend phase is complete for the current SRS/demo scope.

Implemented with simple PHP, not Laravel:

- Student registration and login
- Admin login
- Bearer token authentication
- Student dashboard
- Student profile load/save
- University recommendations
- Scholarship recommendations
- Shortlist add/list/remove
- How-to-apply guide
- Roadmap load/generate/status update
- Template list and PDF/DOCX download
- Writing assistant generate/refine/save fallback
- Admin dashboard
- Admin university CRUD
- Admin scholarship CRUD
- Admin student list/status/delete

## How To Run Backend

```powershell
cd backend
.\start-server.bat
```

API base URL:

```text
http://127.0.0.1:8000/api
```

## Frontend Connection Values

Set these values in `frontend/.env`:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_USE_MOCKS=false
```

Restart the frontend dev server after changing `.env`.

## Demo Credentials

- Student: `student@test.com` / `Test@1234`
- Admin: `admin@saa.local` / `Admin@12345`

The backend auto-restores these demo users if they are removed during testing.

## Acceptance Evidence

Run from the project root:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\srs-acceptance-smoke.ps1
```

Latest result:

```text
SRS acceptance smoke test passed.
```

See:

- `docs/srs-acceptance-report.md`
- `docs/final-presentation-checklist.md`
- `docs/api-contract.md`

## Notes For Frontend Finalization

- Screenshots are intentionally pending until the frontend developer finalizes the UI.
- If login says `Failed to fetch`, confirm the PHP server is running at `http://127.0.0.1:8000/api`.
- If demo login fails after admin testing, restart the backend or run the acceptance smoke test; demo users are restored automatically.
- Template downloads are binary responses, so the frontend download service must use `fetch` + `blob`, not the JSON API helper.
