# Full Stack Project Testing Report

## 1. Project Overview

Project tested: Study Abroad Assistant (SAA)

The project is a full-stack React/PHP application for study abroad planning. It includes public auth pages, a student portal, recommendation tools, shortlist management, document/template tools, and an admin portal for managing universities, scholarships, and students.

Screenshots could not be captured because the built-in browser screenshot endpoint was not exposed in this session.

No external screenshots or fake screenshots were created. Testing continued with real terminal output, API responses, database checks, saved frontend HTML, generated logs, and automated smoke-test output.

## 2. Testing Environment

Frontend:

```text
D:\SAA\saa-project\frontend
React 19 + Vite
```

Backend:

```text
D:\SAA\saa-project\backend
PHP 8.2.12 development server
```

Database/demo storage:

```text
D:\SAA\saa-project\backend\data\database.json
```

Frontend environment:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_USE_MOCKS=false
```

Evidence folder:

```text
D:\SAA\saa-project\docs\testing-evidence
```

## 3. Commands Used

Backend:

```powershell
cd D:\SAA\saa-project\backend
D:\xamp\php\php.exe -S 127.0.0.1:8000 router.php
```

Frontend:

```powershell
cd D:\SAA\saa-project\frontend
npm.cmd run dev -- --host 127.0.0.1
```

Frontend production build:

```powershell
cd D:\SAA\saa-project\frontend
npm.cmd run build
```

PHP lint:

```powershell
cd D:\SAA\saa-project
D:\xamp\php\php.exe -l backend\src\app.php
```

Official smoke test:

```powershell
cd D:\SAA\saa-project
powershell -ExecutionPolicy Bypass -File scripts\srs-acceptance-smoke.ps1
```

Evidence runner:

```powershell
cd D:\SAA\saa-project
powershell -ExecutionPolicy Bypass -File scripts\fullstack-evidence-test.ps1
```

## 4. Frontend Running Evidence

Evidence files:

- `docs/testing-evidence/server-running-evidence.json`
- `docs/testing-evidence/frontend-server.out.log`
- `docs/testing-evidence/frontend-server.err.log`
- `docs/testing-evidence/frontend-app-shell.html`
- `docs/testing-evidence/frontend-build.log`

Result:

- Frontend dev server returned HTTP `200`.
- Saved app shell contains React mount node: `<div id="root">`.
- Production build passed.

Evidence output:

```text
Frontend dev server: status=200; react_root=True
Frontend build: ✓ built in 2.24s
```

Status: Passed

## 5. Backend Running Evidence

Evidence files:

- `docs/testing-evidence/server-running-evidence.json`
- `docs/testing-evidence/backend-server.err.log`
- `docs/testing-evidence/backend-server.out.log`
- `docs/testing-evidence/php-lint.log`

Result:

- Backend API health endpoint returned success.
- PHP syntax lint passed.

Evidence output:

```text
Backend health: success=True; message=Study Abroad Assistant API is running
PHP lint: No syntax errors detected in backend\src\app.php
```

Status: Passed

## 6. API Integration Evidence

Evidence files:

- `docs/testing-evidence/api-feature-results.json`
- `docs/testing-evidence/srs-smoke.log`
- `docs/testing-evidence/server-running-evidence.json`

Official smoke test result:

```text
SRS acceptance smoke test passed.
```

The evidence runner executed 18 feature checks:

```text
feature_count=18
failed_features=0
```

Status: Passed

## 7. Demo Data Used

Seeded student:

```text
student@test.com / Test@1234
```

Seeded admin:

```text
admin@saa.local / Admin@12345
```

Temporary evidence records:

```text
evidence.student.<timestamp>@test.com
Evidence University <timestamp>
Evidence Scholarship <timestamp>
University of Toronto SOP draft
```

Cleanup:

- Temporary student was deleted through `DELETE /api/admin/students/:id`.
- Temporary university was deleted through `DELETE /api/admin/universities/:id`.
- Temporary scholarship was deleted through `DELETE /api/admin/scholarships/:id`.
- Writing assistant created one document record because there is no document delete endpoint.

## 8. Feature-wise Testing Results

| Feature name | Steps performed | Demo data used | API endpoint involved | Expected result | Actual result | Evidence file/log/terminal output | Status |
|---|---|---|---|---|---|---|---|
| Backend health | Started PHP API and called health endpoint | N/A | `GET /api` | `success=true` | `success=True; message=Study Abroad Assistant API is running` | `docs/testing-evidence/server-running-evidence.json` | Passed |
| Frontend dev server | Started Vite and fetched app shell | N/A | `GET http://127.0.0.1:5173` | HTTP 200 with React root | `status=200; react_root=True` | `docs/testing-evidence/frontend-app-shell.html` | Passed |
| Student registration | Submitted valid registration payload | `evidence.student.<timestamp>@test.com` | `POST /auth/register` | New student created | `status=201; user_id=101` | `docs/testing-evidence/api-feature-results.json`; `database-verification.json` | Passed |
| Student login | Logged in with seeded student credentials | `student@test.com / Test@1234` | `POST /auth/login` | Bearer token and student user returned | `status=200; user=student@test.com; role=student` | `docs/testing-evidence/api-feature-results.json` | Passed |
| Student dashboard | Loaded dashboard with student token | `student@test.com` | `GET /student/dashboard` | Dashboard summary returned | `status=200; profile_completion=100` | `docs/testing-evidence/api-feature-results.json` | Passed |
| Student profile save | Submitted valid profile data | GPA `3.55`; countries `Canada`, `Germany` | `PUT /student/profile` | Profile saved and returned | `status=200; gpa=3.55; degree=Master` | `docs/testing-evidence/api-feature-results.json`; `database-verification.json` | Passed |
| University recommendations | Requested Germany recommendations | `country=Germany` | `GET /recommendations/universities?country=Germany` | Filtered university list returned | `status=200; count=3` | `docs/testing-evidence/api-feature-results.json` | Passed |
| Scholarship recommendations | Requested fully funded scholarships | `coverage=Fully Funded` | `GET /recommendations/scholarships?coverage=Fully%20Funded` | Filtered scholarship list returned | `status=200; count=8` | `docs/testing-evidence/api-feature-results.json` | Passed |
| Shortlist add/list/delete | Added, listed, and removed a university shortlist item | `university id=1` | `POST/GET/DELETE /shortlist` | Shortlist updates persisted | `add_status=201; list_count=1; delete_status=200` | `docs/testing-evidence/api-feature-results.json`; `database-verification.json` | Passed |
| Application guide | Loaded guide for university id 1 | Technical University of Munich | `GET /guides/university/1` | Guide data returned | `status=200; entity=Technical University of Munich; docs=6` | `docs/testing-evidence/api-feature-results.json` | Passed |
| Roadmap | Loaded roadmap and updated first milestone | First milestone id from API | `GET /roadmap`; `PATCH /roadmap/milestones/:id` | Milestones returned and update succeeds | `load_status=200; milestones=8; patch_status=200` | `docs/testing-evidence/api-feature-results.json`; `database-verification.json` | Passed |
| Templates | Listed templates and downloaded PDF | `template id=1`, format `pdf` | `GET /templates`; `GET /templates/1/download?format=pdf` | Templates listed and PDF file saved | `list_status=200; count=5; file_bytes=860` | `docs/testing-evidence/api-feature-results.json`; `docs/testing-evidence/template-*.pdf` | Passed |
| Writing assistant | Generated, refined, and saved document | SOP for University of Toronto | `POST /writing/generate`; `POST /writing/:id/refine`; `PUT /writing/:id` | Document lifecycle succeeds | `generate_status=200; document=7; refine_status=200; save_status=200` | `docs/testing-evidence/api-feature-results.json`; `database-verification.json` | Passed |
| Admin login | Logged in with seeded admin credentials | `admin@saa.local / Admin@12345` | `POST /auth/admin/login` | Admin bearer token returned | `status=200; user=admin@saa.local; role=admin` | `docs/testing-evidence/api-feature-results.json` | Passed |
| Admin dashboard | Loaded admin dashboard stats | Admin token | `GET /admin/dashboard` | Counts and recent registrations returned | `status=200; students=2; universities=10` | `docs/testing-evidence/api-feature-results.json` | Passed |
| Admin university CRUD | Created, verified in DB, updated, verified in DB, deleted | `Evidence University <timestamp>` | `POST/PUT/DELETE /admin/universities` | CRUD works and database changes are visible | `create=201; id=11; db_created=True; updated_city=Vancouver; delete=200; db_deleted=True` | `docs/testing-evidence/api-feature-results.json`; `database-verification.json` | Passed |
| Admin scholarship CRUD | Created, verified in DB, updated, verified in DB, deleted | `Evidence Scholarship <timestamp>` | `POST/PUT/DELETE /admin/scholarships` | CRUD works and database changes are visible | `create=201; id=11; db_created=True; updated_coverage=Partial Funding; delete=200; db_deleted=True` | `docs/testing-evidence/api-feature-results.json`; `database-verification.json` | Passed |
| Admin students | Listed students, changed temp student status, deleted temp student | `student_id=101` | `GET /admin/students`; `PATCH /admin/students/:id/status`; `DELETE /admin/students/:id` | Student data includes profile fields; status/delete persists | `list=200; status=200; db_status=inactive; delete=200; db_deleted=True` | `docs/testing-evidence/api-feature-results.json`; `database-verification.json` | Passed |

## 9. Validation and Invalid Input Testing

The validation runner executed 14 invalid-input checks:

```text
validation_count=14
failed_validation=0
```

| Page/Form name | Field tested | Invalid input used | Expected result | Actual result | Evidence file/log/terminal output | Status |
|---|---|---|---|---|---|---|
| Registration | Required fields | Empty values | `422` rejected | `status=422; message=Validation failed` | `docs/testing-evidence/validation-results.json` | Passed |
| Registration | Email | `abc` | `422` rejected | `status=422; message=Validation failed` | `docs/testing-evidence/validation-results.json` | Passed |
| Login | Password | `WrongPass123!` | `401` rejected | `status=401; message=Invalid email or password` | `docs/testing-evidence/validation-results.json` | Passed |
| Registration | Confirm password | `Different@123` | `422` rejected | `status=422; message=Validation failed` | `docs/testing-evidence/validation-results.json` | Passed |
| Registration | Full name | `A` | `422` rejected | `status=422; message=Validation failed` | `docs/testing-evidence/validation-results.json` | Passed |
| Registration | Full name | 121 characters | `422` rejected | `status=422; message=Validation failed` | `docs/testing-evidence/validation-results.json` | Passed |
| Registration | Full name | `<script>alert(1)</script>` | `422` rejected and not saved | `status=422; saved=False` | `docs/testing-evidence/validation-results.json`; `database-verification.json` | Passed |
| Registration | Email uniqueness | `student@test.com` | `422` rejected | `status=422; message=Validation failed` | `docs/testing-evidence/validation-results.json` | Passed |
| Protected route | Authorization | Missing bearer token | `401` rejected | `status=401; message=Unauthenticated` | `docs/testing-evidence/validation-results.json` | Passed |
| Student profile | GPA | `9.9` | `422` rejected | `status=422; message=Validation failed` | `docs/testing-evidence/validation-results.json` | Passed |
| Admin university | Numeric fields | `tuition=abc`, `gpa=xyz` | `422` rejected and not saved | `status=422; saved=False` | `docs/testing-evidence/validation-results.json`; `database-verification.json` | Passed |
| Admin university | Tuition | `-100` | `422` rejected and not saved | `status=422; saved=False` | `docs/testing-evidence/validation-results.json`; `database-verification.json` | Passed |
| Admin university | Application deadline | `not-a-date` | `422` rejected and not saved | `status=422; saved=False` | `docs/testing-evidence/validation-results.json`; `database-verification.json` | Passed |
| Admin scholarship | Coverage type | `Banana` | `422` rejected and not saved | `status=422; saved=False` | `docs/testing-evidence/validation-results.json`; `database-verification.json` | Passed |

## 10. Database Verification

Evidence file:

```text
docs/testing-evidence/database-verification.json
```

Counts before evidence test:

```json
{
  "users": 2,
  "universities": 10,
  "scholarships": 10,
  "documents": 6
}
```

Counts after evidence test:

```json
{
  "users": 2,
  "universities": 10,
  "scholarships": 10,
  "documents": 7
}
```

Database checks:

| Check | Before | After | Expected | Actual | Status |
|---|---:|---:|---|---|---|
| University create/update/delete | 10 | 10 | Created item appears, update persists, deleted item absent | `created=True; updated_city=Vancouver; deleted=True` | Passed |
| Scholarship create/update/delete | 10 | 10 | Created item appears, update persists, deleted item absent | `created=True; updated_coverage=Partial Funding; deleted=True` | Passed |
| Student status/delete | 2 | 2 | Temporary student status changes then student is deleted | `status_before_delete=inactive; deleted=True` | Passed |

Note: document count increased from `6` to `7` because the writing assistant feature creates documents and the current API has no document delete endpoint.

## 11. Issues Found

Resolved during this pass:

- Registration allowed script-like full name input.
- Student profile allowed GPA above `4`.
- Admin university allowed negative tuition.
- Admin university allowed letters in number-only fields and coerced them to `0`.
- Admin university allowed invalid date strings.
- Admin scholarship allowed invalid coverage values.

Remaining non-code issue:

- Screenshots could not be captured because the built-in browser screenshot endpoint was not exposed in this session.

No blocking frontend-backend integration issue remains in the evidence-based tests.

## 12. Fixes Made

Code fixes:

- `backend/src/app.php`
  - Added full-name length and unsafe text validation during registration.
  - Added stricter phone validation.
  - Added profile numeric validation for GPA, budget, IELTS, and TOEFL.
  - Added admin university validation for numeric fields, negative values, dates, URLs, text length, and unsafe text.
  - Added admin scholarship validation for coverage type, dates, URLs, text length, and unsafe text.
  - Added reusable validation helpers.

Testing/evidence tooling:

- `scripts/fullstack-evidence-test.ps1`
  - Starts backend and frontend.
  - Confirms both are running.
  - Runs live API feature tests.
  - Runs invalid-input validation tests.
  - Verifies database records before/after CRUD.
  - Saves evidence files in `docs/testing-evidence`.

Report:

- `Fullstack_Testing_Report_No_Screenshots.md`

## 13. Final Verdict

Final verdict: Working.

The frontend and backend are correctly connected in live mode with `VITE_USE_MOCKS=false`. The backend health check, frontend app shell, production build, official smoke test, live API feature tests, validation tests, and database verification all passed.

Screenshot proof is not included because the built-in browser screenshot endpoint was not exposed in this session, and no fake or external screenshots were created.
