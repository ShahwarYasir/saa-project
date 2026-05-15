# Study Abroad Assistant (SAA)

Study Abroad Assistant is a full-stack academic demo project that helps students plan international education applications. It includes a React student portal, a React admin portal, and a simple framework-free PHP API backed by MySQL through PDO prepared statements.

The project has been integrated and tested end-to-end in live API mode. The frontend can run with mock data for UI-only work, or with the PHP backend for full-stack testing.

## Project Status

Status: Working and integrated.

Verified areas:

- Frontend development server starts successfully.
- Backend PHP API starts successfully.
- Frontend communicates with backend APIs in live mode.
- MySQL schema and seed data work through XAMPP MySQL/MariaDB.
- Student authentication and profile flows work.
- University and scholarship recommendations work.
- Shortlist, roadmap, templates, and writing assistant flows work.
- Admin dashboard and CRUD flows work.
- Backend validation rejects invalid input.
- Production frontend build passes.
- Automated full-stack evidence script passes.

Testing report:

- [MYSQL_MIGRATION_AND_TESTING_REPORT.md](MYSQL_MIGRATION_AND_TESTING_REPORT.md)

Note: Screenshots were not included in the testing report because the built-in browser screenshot endpoint was not exposed in the testing session. No fake screenshots were created.

## Features

### Public Features

- Home page
- Student registration
- Student login
- Admin login
- Protected student and admin routes

### Student Portal

- Dashboard summary
- Profile builder
- University recommendations
- Scholarship recommendations
- Shortlist add/list/remove
- How-to-apply guide
- Application roadmap
- Template list and download
- Writing assistant draft, refine, and save flow

### Admin Portal

- Admin dashboard statistics
- Manage universities
- Create, update, and delete universities
- Manage scholarships
- Create, update, and delete scholarships
- Manage students
- Activate, deactivate, and delete student accounts

### Validation and Security

- Required-field validation
- Email and password validation
- Duplicate email rejection
- Numeric range validation
- Date and URL validation
- Basic unsafe text/script-like input rejection
- Bearer-token authentication for protected API routes
- Role-based access for admin routes

## Tech Stack

### Frontend

- React 19
- Vite 8
- React Router 7
- Bootstrap 5
- Bootstrap Icons
- React Hook Form
- Yup validation
- Vitest

### Backend

- PHP 8.1+ recommended
- Framework-free PHP API
- MySQL/MariaDB persistence
- PDO prepared statements
- HMAC JWT-style bearer authentication
- No Composer required
- No Laravel or PHP framework

## Requirements

- Git
- Node.js 18+
- npm
- PHP 8.1+
- MySQL or MariaDB, such as XAMPP MySQL

For Windows/XAMPP users, PHP may be available at:

```powershell
D:\xamp\php\php.exe
```

If `php` is already available in PATH, use `php` directly.

## Project Structure

```text
saa-project/
|-- backend/                         # PHP API
|   |-- database/                    # MySQL schema, seed, setup notes
|   |-- public/
|   |-- src/
|   |-- router.php
|   |-- start-server.bat
|   `-- README.md
|-- frontend/                        # React + Vite app
|   |-- public/
|   |-- src/
|   |-- package.json
|   |-- start-dev.bat
|   `-- README.md
|-- docs/                            # API contract, setup guide, demo docs
|-- scripts/                         # Smoke tests and full-stack evidence tests
|-- MYSQL_MIGRATION_AND_TESTING_REPORT.md
`-- README.md
```

## Environment Setup

### Backend Environment

Create the backend environment file:

```powershell
cd backend
Copy-Item .env.example .env
```

Important backend settings:

```env
APP_URL=http://127.0.0.1:8000
FRONTEND_URL=http://localhost:5173,http://127.0.0.1:5173
JWT_SECRET=change_this_to_a_long_random_secret
JWT_TTL_MINUTES=120
AI_PROVIDER=none
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=saa_project
DB_USERNAME=root
DB_PASSWORD=
```

For a demo or local semester project, the example values are enough. For any public deployment, change `JWT_SECRET`.

### Frontend Environment

Create the frontend environment file:

```powershell
cd frontend
Copy-Item .env.example .env
```

For full-stack mode, use:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_APP_NAME=Study Abroad Assistant
VITE_USE_MOCKS=false
```

For UI-only mock mode, use:

```env
VITE_USE_MOCKS=true
```

Restart the Vite server after changing `.env`.

## Install Dependencies

Install frontend dependencies:

```powershell
cd frontend
npm install
```

The backend does not require Composer packages.

## MySQL Setup

Start MySQL from XAMPP, then import the schema:

```powershell
D:\xamp\mysql\bin\mysql.exe -u root --execute="SOURCE D:/SAA/saa-project/backend/database/schema.sql"
```

Seed demo data:

```powershell
D:\xamp\php\php.exe backend\database\seed.php
```

If `mysql` and `php` are available in PATH:

```powershell
mysql -u root --execute="SOURCE D:/SAA/saa-project/backend/database/schema.sql"
php backend\database\seed.php
```

Detailed database setup:

- [backend/database/README.md](backend/database/README.md)

## Run the Project

Open two terminals.

### Terminal 1: Start Backend

From the project root:

```powershell
cd backend
php -S 127.0.0.1:8000 router.php
```

If using XAMPP PHP on this machine:

```powershell
cd backend
D:\xamp\php\php.exe -S 127.0.0.1:8000 router.php
```

Backend API URL:

```text
http://127.0.0.1:8000/api
```

Windows helper:

```powershell
backend\start-server.bat
```

### Terminal 2: Start Frontend

From the project root:

```powershell
cd frontend
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

Windows helper:

```powershell
frontend\start-dev.bat
```

## Demo Credentials

### Student

```text
Email: student@test.com
Password: Test@1234
```

### Admin

```text
Email: admin@saa.local
Password: Admin@12345
```

The seed script creates required demo users and demo records.

## Database and Demo Data

The backend stores demo data in MySQL:

```text
saa_project
```

To reset local demo data, run:

```powershell
D:\xamp\php\php.exe backend\database\seed.php
```

Do not commit generated local evidence files unless they are intentionally needed for a handoff.

## API Overview

Base URL:

```text
http://127.0.0.1:8000/api
```

Auth format:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

Main API groups:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/admin/login`
- `GET /api/auth/me`
- `GET /api/student/dashboard`
- `GET /api/student/profile`
- `PUT /api/student/profile`
- `GET /api/recommendations/universities`
- `GET /api/recommendations/scholarships`
- `GET /api/shortlist`
- `POST /api/shortlist`
- `DELETE /api/shortlist/{id}`
- `GET /api/guides/{entity_type}/{id}`
- `GET /api/roadmap`
- `POST /api/roadmap/generate`
- `PATCH /api/roadmap/milestones/{id}`
- `GET /api/templates`
- `GET /api/templates/{id}/download`
- `POST /api/writing/generate`
- `POST /api/writing/{id}/refine`
- `PUT /api/writing/{id}`
- `GET /api/admin/dashboard`
- `GET /api/admin/universities`
- `POST /api/admin/universities`
- `PUT /api/admin/universities/{id}`
- `DELETE /api/admin/universities/{id}`
- `GET /api/admin/scholarships`
- `POST /api/admin/scholarships`
- `PUT /api/admin/scholarships/{id}`
- `DELETE /api/admin/scholarships/{id}`
- `GET /api/admin/students`
- `PATCH /api/admin/students/{id}/status`
- `DELETE /api/admin/students/{id}`

Full API documentation:

- [docs/api-contract.md](docs/api-contract.md)

## Testing

### Full-Stack Evidence Test

This is the best end-to-end verification command. It starts the backend and frontend, calls real APIs, checks validation, verifies MySQL database changes, and writes local evidence files.

```powershell
powershell -ExecutionPolicy Bypass -File scripts\fullstack-evidence-test.ps1
```

Expected result:

```text
failed_features=0
failed_validation=0
```

Generated evidence is saved locally under:

```text
docs/testing-evidence/mysql-migration/
```

This folder is ignored by Git.

### SRS Smoke Test

```powershell
powershell -ExecutionPolicy Bypass -File scripts\srs-acceptance-smoke.ps1
```

Expected result:

```text
SRS acceptance smoke test passed.
```

### Frontend Production Build

```powershell
cd frontend
npm.cmd run build
```

### Backend Syntax Check

```powershell
php -l backend\src\app.php
```

With XAMPP PHP:

```powershell
D:\xamp\php\php.exe -l backend\src\app.php
```

## Documentation

- [docs/setup-guide.md](docs/setup-guide.md)
- [docs/api-contract.md](docs/api-contract.md)
- [docs/component-map.md](docs/component-map.md)
- [backend/database/README.md](backend/database/README.md)
- [docs/demo-script.md](docs/demo-script.md)
- [docs/final-presentation-checklist.md](docs/final-presentation-checklist.md)
- [docs/srs-acceptance-report.md](docs/srs-acceptance-report.md)
- [frontend/handoff.md](frontend/handoff.md)
- [MYSQL_MIGRATION_AND_TESTING_REPORT.md](MYSQL_MIGRATION_AND_TESTING_REPORT.md)

## Troubleshooting

| Problem | Fix |
|---|---|
| `php` is not recognized | Install PHP or use the XAMPP path `D:\xamp\php\php.exe`. |
| MySQL connection failed | Start MySQL in XAMPP and confirm backend `.env` DB values. |
| Unknown database `saa_project` | Import `backend/database/schema.sql`. |
| Frontend cannot login | Confirm backend is running and `VITE_USE_MOCKS=false`. |
| CORS error | Confirm `FRONTEND_URL` includes `http://localhost:5173` and `http://127.0.0.1:5173`. |
| API returns unauthenticated | Log out, clear old local storage tokens, and login again. |
| Need fresh demo data | Run `D:\xamp\php\php.exe backend\database\seed.php`. |
| Port already in use | Stop the old server process or run the server on another port and update `.env`. |
| PowerShell blocks scripts | Run commands with `powershell -ExecutionPolicy Bypass -File ...`. |

## Known Limitations

- The backend uses MySQL through simple PHP PDO, not Laravel.
- The writing assistant uses a local generated text fallback, not a paid external AI service.
- Email notifications, SMS notifications, visa services, payment flows, and external application submission are outside the current project scope.
- The testing report uses logs, API responses, and database evidence because screenshot capture was unavailable in the test session.

## Team

| Role | Name |
|---|---|
| Frontend Developer | Dur-e-Shahwar |
| Backend Developer | Hasana Zahid |

## License

This project is part of an academic semester project.
