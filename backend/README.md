# SAA Backend - Simple PHP + MySQL API

This backend is a framework-free PHP API for the Study Abroad Assistant React frontend. It keeps the existing `/api/...` route contract and JSON response shapes, but now uses MySQL through PDO prepared statements instead of `backend/data/database.json`.

## Requirements

- PHP 8.1+ recommended
- PHP `pdo_mysql` extension enabled
- MySQL or MariaDB, such as XAMPP MySQL/phpMyAdmin
- No Laravel
- No Composer required
- No PHP framework required

## Database

Default database:

```text
saa_project
```

Database files:

- `backend/database/schema.sql`
- `backend/database/seed.php`
- `backend/database/README.md`
- `backend/src/db.php`

Create schema:

```powershell
D:\xamp\mysql\bin\mysql.exe -u root --execute="SOURCE D:/SAA/saa-project/backend/database/schema.sql"
```

Seed demo data:

```powershell
D:\xamp\php\php.exe backend\database\seed.php
```

## Environment

Copy the example file:

```powershell
cd backend
Copy-Item .env.example .env
```

Required database values:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=saa_project
DB_USERNAME=root
DB_PASSWORD=
```

## Run Locally

```powershell
cd backend
D:\xamp\php\php.exe -S 127.0.0.1:8000 router.php
```

If PHP is available in PATH:

```powershell
cd backend
php -S 127.0.0.1:8000 router.php
```

API base URL:

```text
http://127.0.0.1:8000/api
```

## Demo Credentials

- Student: `student@test.com` / `Test@1234`
- Admin: `admin@saa.local` / `Admin@12345`

## Implemented Areas

- Student/admin login with HMAC JWT-style bearer tokens
- Student registration, profile, dashboard, recommendations, shortlist, guide, roadmap, templates, and writing assistant
- Admin dashboard, university CRUD, scholarship CRUD, and student status/delete actions
- MySQL persistence with PDO prepared statements
- CORS for the Vite dev server

## Testing

From the project root:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\fullstack-evidence-test.ps1
powershell -ExecutionPolicy Bypass -File scripts\srs-acceptance-smoke.ps1
```

Evidence is saved in:

```text
docs/testing-evidence/mysql-migration/
```

## Notes

The backend is intentionally simple PHP for semester/demo use. For production, use stronger secret management, avoid resetting seed data in production, add database migrations per release, and review deployment security settings.
