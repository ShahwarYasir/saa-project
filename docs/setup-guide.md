# SAA Setup Guide

## Prerequisites

- Node.js 18+ for the React frontend
- PHP 8.1+ for the simple PHP backend
- MySQL/MariaDB, such as XAMPP MySQL
- Git

No Composer, Laravel, or PHP framework is required.

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

```powershell
cd backend
Copy-Item .env.example .env
```

Import the MySQL schema from the project root:

```powershell
D:\xamp\mysql\bin\mysql.exe -u root --execute="SOURCE D:/SAA/saa-project/backend/database/schema.sql"
```

Seed demo data:

```powershell
D:\xamp\php\php.exe backend\database\seed.php
```

Start the backend:

```powershell
cd backend
php -S 127.0.0.1:8000 router.php
```

The API runs at:

```text
http://127.0.0.1:8000/api
```

The backend uses the MySQL database `saa_project`.

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

Run the MySQL full-stack evidence test:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\fullstack-evidence-test.ps1
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
| MySQL connection failed | Start MySQL in XAMPP and confirm backend `.env` DB values |
| Unknown database `saa_project` | Import `backend/database/schema.sql` |
| CORS errors | Confirm the backend `.env` has `FRONTEND_URL=http://localhost:5173,http://127.0.0.1:5173` |
| Login fails after changing `JWT_SECRET` | Log out in the browser and sign in again |
| Need fresh demo data | Run `D:\xamp\php\php.exe backend\database\seed.php` |
