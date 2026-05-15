# MySQL Migration and Full-Stack Testing Report

## 1. Project Overview

Project: Study Abroad Assistant (SAA)

SAA is a full-stack React and simple PHP application for study abroad planning. It includes public authentication pages, a student portal, recommendations, shortlist management, roadmap/tools, writing assistance, and an admin portal for managing students, universities, and scholarships.

The project was migrated from JSON-file persistence to MySQL while keeping the existing React frontend, API routes, and JSON response formats working.

Screenshots could not be captured because the built-in browser screenshot endpoint/tool was not exposed in this session. No external screenshots or fake screenshots were created. Testing evidence uses terminal logs, API responses, MySQL query results, database before/after records, and frontend build output.

## 2. Previous Storage System

The previous backend stored all demo data in:

```text
backend/data/database.json
```

The old backend loaded the full JSON file into PHP arrays and wrote the full file back after create, update, and delete operations.

## 3. New Storage System

The backend now uses:

```text
MySQL/MariaDB database: saa_project
Simple PHP PDO prepared statements
```

No Laravel, Composer, or PHP framework was added.

## 4. Files Changed

- `README.md`
- `backend/.env.example`
- `backend/README.md`
- `backend/database/README.md`
- `backend/database/schema.sql`
- `backend/database/seed.php`
- `backend/src/app.php`
- `backend/src/db.php`
- `docs/demo-script.md`
- `docs/setup-guide.md`
- `docs/srs-acceptance-report.md`
- `scripts/fullstack-evidence-test.ps1`
- `MYSQL_MIGRATION_AND_TESTING_REPORT.md`

## 5. Database Schema Summary

| Table | Purpose |
|---|---|
| `users` | Student/admin accounts, hashed passwords, roles, status, registration date |
| `profiles` | Student profile data, academic info, preferences, language scores, scholarship need |
| `universities` | University recommendation and admin CRUD data |
| `scholarships` | Scholarship recommendation and admin CRUD data |
| `shortlists` | Student saved universities and scholarships |
| `roadmap_milestones` | Student roadmap milestones and statuses |
| `templates` | Downloadable document template metadata |
| `documents` | Writing assistant generated/refined/saved drafts |

Schema file:

```text
backend/database/schema.sql
```

Seed file:

```text
backend/database/seed.php
```

## 6. Environment Setup

Backend command:

```powershell
cd backend
D:\xamp\php\php.exe -S 127.0.0.1:8000 router.php
```

Frontend command:

```powershell
cd frontend
npm run dev
```

Database:

```text
saa_project
```

API base URL:

```text
http://127.0.0.1:8000/api
```

Frontend URL:

```text
http://127.0.0.1:5173
```

Database environment values:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=saa_project
DB_USERNAME=root
DB_PASSWORD=
```

## 7. Demo Data and Credentials

Student:

```text
student@test.com / Test@1234
```

Admin:

```text
admin@saa.local / Admin@12345
```

Seeded demo records:

- 3 users
- 1 student profile
- 10 universities
- 10 scholarships
- 5 shortlist records
- 8 roadmap milestones
- 5 templates

Password storage evidence:

```text
docs/testing-evidence/mysql-migration/mysql-demo-user-proof.txt
```

The demo user query shows password hash lengths of 60 characters, confirming that demo passwords are stored as hashes, not plain text.

Seed command:

```powershell
D:\xamp\php\php.exe backend\database\seed.php
```

## 8. Migration Changes

- Added `backend/src/db.php` for PDO connection and MySQL load/save helpers.
- Added `backend/database/schema.sql` for the full MySQL schema.
- Added `backend/database/seed.php` to reset and seed demo data safely without duplicate rows.
- Replaced JSON-file reads/writes in `backend/src/app.php` with MySQL-backed `saa_load_db()` and `saa_save_db()`.
- Kept existing route handlers and response shapes so the frontend API contract remains stable.
- Kept existing validation, authentication, CORS, and role checks.
- Updated evidence testing to read MySQL directly for database verification.

## 9. Feature-wise Testing

Evidence file:

```text
docs/testing-evidence/mysql-migration/api-feature-results.json
```

Summary:

```text
feature_count=18
failed_features=0
```

| Feature name | Steps performed | Demo data used | Expected result | Actual result | Evidence | Status |
|---|---|---|---|---|---|---|
| Backend health | Started PHP API and called health endpoint | N/A | API returns success | `success=True; message=Study Abroad Assistant API is running` | `server-running-evidence.json` | Passed |
| Frontend dev server | Started Vite and fetched app shell | N/A | HTTP 200 with React root | `status=200; react_root=True` | `frontend-app-shell.html` | Passed |
| Student registration | Submitted valid registration payload | `evidence.student.<timestamp>@test.com` | New student created | `status=201; user_id=101` | `api-feature-results.json`; `database-verification.json` | Passed |
| Student login | Logged in with seeded student credentials | `student@test.com / Test@1234` | Token and student user returned | `status=200; user=student@test.com; role=student` | `api-feature-results.json` | Passed |
| Student dashboard | Loaded dashboard with student token | `student@test.com` | Dashboard summary returned | `status=200; profile_completion=100` | `api-feature-results.json` | Passed |
| Student profile save | Submitted valid profile data | GPA `3.55`, Canada/Germany preferences | Profile saved | `status=200; gpa=3.55; degree=Master` | `api-feature-results.json`; `database-verification.json` | Passed |
| University recommendations | Requested Germany recommendations | `country=Germany` | Filtered universities returned | `status=200; count=3` | `api-feature-results.json` | Passed |
| Scholarship recommendations | Requested fully funded scholarships | `coverage=Fully Funded` | Filtered scholarships returned | `status=200; count=8` | `api-feature-results.json` | Passed |
| Shortlist add/list/delete | Added, listed, and removed a university | `university id=10` | MySQL record created then deleted | `add_status=201; db_added=True; list_count=4; delete_status=200; db_deleted=True` | `api-feature-results.json`; `database-verification.json` | Passed |
| Application guide | Loaded guide for university id 1 | Technical University of Munich | Guide data returned | `status=200; entity=Technical University of Munich; docs=6` | `api-feature-results.json` | Passed |
| Roadmap | Loaded roadmap and updated milestone | First milestone from API | Milestones returned and update succeeds | `load_status=200; milestones=8; patch_status=200` | `api-feature-results.json`; `database-verification.json` | Passed |
| Templates | Listed templates and downloaded PDF | `template id=1`, format `pdf` | Templates listed and PDF saved | `list_status=200; count=5; file_bytes=860` | `api-feature-results.json`; `template-*.pdf` | Passed |
| Writing assistant | Generated, refined, and saved a document | SOP for University of Toronto | Document lifecycle succeeds | `generate_status=200; document=1; refine_status=200; save_status=200` | `api-feature-results.json`; `database-verification.json` | Passed |
| Admin login | Logged in with seeded admin credentials | `admin@saa.local / Admin@12345` | Admin token returned | `status=200; user=admin@saa.local; role=admin` | `api-feature-results.json` | Passed |
| Admin dashboard | Loaded admin dashboard stats | Admin token | Counts returned | `status=200; students=3; universities=10` | `api-feature-results.json` | Passed |
| Admin university CRUD | Created, verified, updated, verified, deleted | `Evidence University <timestamp>` | CRUD persists in MySQL | `create=201; id=11; db_created=True; updated_city=Vancouver; delete=200; db_deleted=True` | `api-feature-results.json`; `database-verification.json` | Passed |
| Admin scholarship CRUD | Created, verified, updated, verified, deleted | `Evidence Scholarship <timestamp>` | CRUD persists in MySQL | `create=201; id=11; db_created=True; updated_coverage=Partial Funding; delete=200; db_deleted=True` | `api-feature-results.json`; `database-verification.json` | Passed |
| Admin students | Listed students, changed temp student status, deleted temp student | `student_id=101` | Student management persists | `list=200; status=200; db_status=inactive; delete=200; db_deleted=True` | `api-feature-results.json`; `database-verification.json` | Passed |

Additional smoke test:

```text
docs/testing-evidence/mysql-migration/srs-smoke-log.txt
```

Result:

```text
SRS acceptance smoke test passed.
```

Frontend build:

```text
docs/testing-evidence/mysql-migration/frontend-build-log.txt
```

Result: production build passed. Vite reported a non-blocking chunk-size warning.

PHP syntax check:

```text
docs/testing-evidence/mysql-migration/php-syntax-check.txt
```

Result: no syntax errors in changed PHP files.

## 10. Validation and Invalid Input Testing

Evidence file:

```text
docs/testing-evidence/mysql-migration/validation-results.json
```

Summary:

```text
validation_count=22
failed_validation=0
```

| Form/API | Invalid input | Expected result | Actual result | Was invalid data saved? | Status |
|---|---|---|---|---|---|
| Registration required fields | Empty values | `422` rejected | `status=422; message=Validation failed` | No | Passed |
| Registration email | `abc` | `422` rejected | `status=422; message=Validation failed` | No | Passed |
| Registration email | `user.com` | `422` rejected | `status=422; message=Validation failed` | No | Passed |
| Login password | `WrongPass123!` | `401` rejected | `status=401; message=Invalid email or password` | No | Passed |
| Registration password | `Short1!` | `422` rejected | `status=422; saved=False` | No | Passed |
| Registration confirm password | `Different@123` | `422` rejected | `status=422; message=Validation failed` | No | Passed |
| Registration full name | `A` | `422` rejected | `status=422; message=Validation failed` | No | Passed |
| Registration full name | 121 characters | `422` rejected | `status=422; message=Validation failed` | No | Passed |
| Registration full name | `<script>alert(1)</script>` | `422` rejected | `status=422; saved=False` | No | Passed |
| Registration duplicate email | `student@test.com` | `422` rejected | `status=422; message=Validation failed` | No | Passed |
| Protected route | Missing bearer token | `401` rejected | `status=401; message=Unauthenticated` | No | Passed |
| Admin route | Student token | `403` rejected | `status=403; message=Forbidden` | No | Passed |
| Shortlist entity ID | `university id 999999` | `422` rejected | `status=422; message=Invalid shortlist item` | No | Passed |
| Application guide entity ID | `university id 999999` | `404` rejected | `status=404; message=Item not found` | No | Passed |
| Student profile GPA | `9.9` | `422` rejected | `status=422; message=Validation failed` | No | Passed |
| Admin university numeric fields | `tuition=abc`, `gpa=xyz` | `422` rejected | `status=422; saved=False` | No | Passed |
| Admin university tuition | `-100` | `422` rejected | `status=422; saved=False` | No | Passed |
| Admin university date | `not-a-date` | `422` rejected | `status=422; saved=False` | No | Passed |
| Admin university URL | `not-a-url` | `422` rejected | `status=422; saved=False` | No | Passed |
| Admin university update ID | `id 999999` | `404` rejected | `status=404; message=University not found` | No | Passed |
| Admin scholarship coverage | `Banana` | `422` rejected | `status=422; saved=False` | No | Passed |
| Admin scholarship delete ID | `id 999999` | `404` rejected | `status=404; message=Item not found` | No | Passed |

## 11. Frontend-Backend-Database Integration Verification

Evidence files:

- `docs/testing-evidence/mysql-migration/api-feature-results.json`
- `docs/testing-evidence/mysql-migration/database-verification.json`
- `docs/testing-evidence/mysql-migration/database-before-after.md`
- `docs/testing-evidence/mysql-migration/mysql-table-counts.txt`

Verified database changes:

| Frontend/API action | MySQL verification |
|---|---|
| Student registration | Temporary student inserted, status changed, then deleted |
| Student profile save | Profile values saved and returned from API |
| Shortlist add/delete | Shortlist row created for university id 10, then removed |
| Roadmap milestone update | Milestone status update succeeded |
| Writing assistant generate/refine/save | Document row created and updated |
| Admin university CRUD | University row created, updated, and deleted |
| Admin scholarship CRUD | Scholarship row created, updated, and deleted |
| Admin student management | Student status updated to inactive, then student deleted |

Database before/after evidence:

```text
Before evidence test: users=3, universities=10, scholarships=10, shortlists=5, documents=0
After evidence test:  users=3, universities=10, scholarships=10, shortlists=5, documents=1
```

Document count increased because the writing assistant feature creates a saved draft and the current API has no document delete endpoint.

## 12. Issues Found

No blocking issue found during testing.

Non-blocking notes:

- Screenshots could not be captured because the built-in browser screenshot endpoint/tool was not exposed in this session.
- Frontend build passed with a Vite chunk-size warning. This does not block local use or the migration.
- During testing, the evidence script initially used an ambiguous PowerShell interpolated URL for shortlist deletion. It was fixed and rerun successfully.

## 13. Fixes Made

Code fixes/migration work:

- Added PDO/MySQL connection layer in `backend/src/db.php`.
- Replaced JSON-file persistence calls in `backend/src/app.php` with MySQL load/save calls.
- Added MySQL schema and seed workflow under `backend/database/`.
- Added database environment variables to `backend/.env.example`.
- Updated `scripts/fullstack-evidence-test.ps1` to verify MySQL before/after records.
- Fixed the shortlist evidence-test URL interpolation and reran testing.

No frontend redesign was made.

## 14. Remaining Limitations

- The backend still loads the current dataset into PHP arrays and persists through a MySQL-backed storage adapter to preserve the existing route code and frontend response contract. This is acceptable for the current academic/demo scope, but a larger production system should move each endpoint to targeted SQL queries.
- The writing assistant uses a local generated-text fallback, not a paid external AI provider.
- The seed script resets the demo database to a known state; it should not be used against production data.
- Screenshots are not included because screenshot capability was unavailable in this session.

## 15. Final Verdict

Final verdict: Working.

All critical student and admin flows passed against the MySQL-backed backend. PHP syntax checks passed, the backend and frontend servers started, the frontend app shell loaded, the production frontend build passed, API integration tests passed, validation tests passed, and MySQL before/after verification confirmed persistence for create/update/delete operations.
