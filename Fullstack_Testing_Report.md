# Full Stack Project Testing Report

## 1. Project Overview

Project tested: Study Abroad Assistant (SAA)

The project is a full-stack study abroad guidance application with:

- Frontend: React 19, Vite, Bootstrap
- Backend: framework-free PHP API
- Data storage: JSON demo database at `backend/data/database.json`
- API base path: `/api`

Testing goal: verify that the completed frontend and backend are connected correctly and that major API-backed workflows work end to end.

Important screenshot note: the requested built-in browser/screenshot tool was not available in this session. The Browser skill was loaded, but the required Node REPL browser-control endpoint was not exposed, and MCP browser resources were empty. Because the user explicitly prohibited external screenshot methods and fake screenshots, no screenshots were generated.

## 2. Testing Environment

Frontend folder:

```text
D:\SAA\saa-project\frontend
```

Backend folder:

```text
D:\SAA\saa-project\backend
```

Backend command used:

```powershell
cd D:\SAA\saa-project\backend
D:\xamp\php\php.exe -S 127.0.0.1:8000 router.php
```

Frontend command used:

```powershell
cd D:\SAA\saa-project\frontend
npm.cmd run dev -- --host 127.0.0.1
```

Frontend URL:

```text
http://localhost:5173
http://127.0.0.1:5173
```

Backend URL/API base URL:

```text
http://127.0.0.1:8000/api
```

Frontend environment:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_USE_MOCKS=false
```

Server startup verification:

- Backend health endpoint returned: `Study Abroad Assistant API is running`
- Frontend dev server returned HTTP `200`
- Frontend response contained the React root: `<div id="root">`

Build/lint verification:

- PHP lint passed: `No syntax errors detected in backend\src\app.php`
- Frontend build passed with `npm.cmd run build`
- Official SRS smoke test passed

Database/demo data used:

- Existing demo JSON database: `backend/data/database.json`
- Temporary test records were created through API and deleted during cleanup.

## 3. Test Credentials / Demo Data

Student demo account:

```text
Email: student@test.com
Password: Test@1234
```

Admin demo account:

```text
Email: admin@saa.local
Password: Admin@12345
```

Temporary data used:

- Student: `fullstack.student.<timestamp>@test.com`
- University: `Fullstack Test University <timestamp>`
- Scholarship: `Fullstack Test Scholarship <timestamp>`
- Negative/invalid validation records were deleted after testing when the backend allowed them.

## 4. Feature-wise Testing

| Feature name | Steps performed | Test data used | Expected result | Actual result | Status | Screenshot |
|---|---|---|---|---|---|---|
| Project setup | Inspected root folders, frontend folder, backend folder, `.env`, dependencies | Existing project files | Frontend/backend folders identified; deps available | `backend` and `frontend` found; `node_modules` exists; mocks disabled | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Backend health | Started PHP server and requested `/api` | `GET /api` | API returns health JSON | API returned `success=true`, message `Study Abroad Assistant API is running` | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Frontend dev server | Started Vite server and requested frontend URL | `GET http://127.0.0.1:5173` | Frontend app shell loads | HTTP `200`; React root found | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Student registration | Submitted valid registration API payload | `fullstack.student.<timestamp>@test.com` | Account created with user id | Backend returned success and `user_id` | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Student login | Submitted valid demo login | `student@test.com / Test@1234` | Token and user returned | Bearer token returned; role `student` | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Protected auth | Requested student dashboard without token | No auth header | Request rejected | Backend returned `401 Unauthenticated` | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Student dashboard | Logged in and requested dashboard | Student token | Dashboard summary returned | Profile completion and dashboard data returned | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Student profile | Loaded and updated profile | Demo student profile data | Profile saved and returned | `Profile updated successfully` | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| University recommendations | Requested filtered recommendations | `country=Germany` | Filtered universities returned | Germany results returned | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Scholarship recommendations | Requested filtered recommendations | `coverage=Fully Funded` | Filtered scholarships returned | Fully funded scholarship results returned | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Shortlist add/list/remove | Added university, listed shortlist, removed it | `entity_type=university`, `entity_id=10` and `1` | Add/list/delete works | Add, list, duplicate check, and delete all worked | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Application guide | Requested university application guide | `GET /guides/university/1` | Guide data returned | Guide returned for Technical University of Munich | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Roadmap | Loaded roadmap and updated milestone | Milestone status `Done` | Milestones returned and update accepted | Roadmap loaded; milestone updated | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Templates | Listed templates and tested download | Template `1`, PDF | Templates listed and file downloadable | 5 templates listed; PDF download smoke passed | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Writing assistant | Generated, refined, and saved document | SOP demo payload | Document created/refined/saved | Document generated, refined, and saved | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Admin login | Logged in via admin endpoint and alias | `admin@saa.local / Admin@12345` | Admin bearer token returned | Admin token returned through `/admin/auth/login` and `/auth/admin/login` | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Admin dashboard | Requested dashboard stats | Admin token | Counts and recent registrations returned | Dashboard stats returned | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Admin university CRUD | Created, updated, deleted university using frontend payload shape | `portal_url`, `programs`, `tuition_fee_usd`, etc. | CRUD works and data round-trips | Create returned `portal_url` and `website`; update/delete worked | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Admin scholarship CRUD | Created, updated, deleted scholarship using frontend payload shape | `country`, `coverage_type`, `amount`, `application_deadline`, `portal_url` | CRUD works and aliases round-trip | Create/update/delete worked; `coverage_type` mapped to canonical `coverage` | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Admin students | Listed students, checked profile fields, changed status, deleted temp student | Temporary student account | Students list includes admin fields; status/delete works | List included completion data; status and delete worked | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Frontend production build | Ran `npm.cmd run build` | Existing frontend source | Build completes | Build completed successfully | Passed | Not captured: built-in browser screenshot endpoint unavailable |

## 5. Validation and Error Handling Testing

| Page/Form name | Field tested | Invalid input used | Expected result | Actual result | Status | Screenshot |
|---|---|---|---|---|---|---|
| Login | Password | Wrong password | Reject login | `401 Invalid email or password` | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Registration | Email | `abc` | Reject invalid email | `422 Validation failed` | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Registration | Password | `abc` | Reject weak/short password | `422 Validation failed` | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Registration | Confirm password | Mismatched password | Reject mismatch | `422 Validation failed` | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Registration | Phone | `123` | Reject too-short phone | `422 Validation failed` | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Registration | Email uniqueness | Duplicate email | Reject duplicate | `422 Validation failed` | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Registration | Full name | `<script>alert(1)</script>` | Reject or sanitize script-like input | Backend accepted the value and created a user; test user was deleted | Failed | Not captured: built-in browser screenshot endpoint unavailable |
| Protected route | Authorization | No token | Reject request | `401 Unauthenticated` | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Student profile | GPA | `9.9` | Reject GPA above 4 and do not save | Backend accepted and saved `9.9`; profile was restored | Failed | Not captured: built-in browser screenshot endpoint unavailable |
| Shortlist | Entity id | `999999` | Reject invalid item | `422 Invalid shortlist item` | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Shortlist | Duplicate item | Same university twice | Reject duplicate | `409 Already in shortlist` | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Roadmap | Milestone status | `Finished` | Reject invalid status | `422 Invalid milestone status` | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Templates | Download format | `exe` | Reject unsupported format | `422 Unsupported template format` | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Writing assistant | Required text | Empty target university | Reject missing field | `422 Validation failed` | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Admin login | Password | Wrong password | Reject login | `401 Invalid admin credentials` | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Admin university form | Name | Missing name | Reject required field | `422 Validation failed` | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Admin university form | Tuition | `-100` | Reject negative tuition and do not save | Backend accepted and saved negative tuition; record was deleted | Failed | Not captured: built-in browser screenshot endpoint unavailable |
| Admin university form | Numeric fields | `abc`, `xyz` | Reject letters in numeric fields | Backend converted values to `0` and saved; record was deleted | Failed | Not captured: built-in browser screenshot endpoint unavailable |
| Admin university form | Date | `not-a-date` | Reject invalid date | Backend accepted invalid date string; record was deleted | Failed | Not captured: built-in browser screenshot endpoint unavailable |
| Admin scholarship form | Provider | Missing provider | Reject required field | `422 Validation failed` | Passed | Not captured: built-in browser screenshot endpoint unavailable |
| Admin scholarship form | Coverage type | `Banana` | Reject invalid coverage option | Backend accepted invalid coverage type; record was deleted | Failed | Not captured: built-in browser screenshot endpoint unavailable |
| Admin students | Status | `paused` | Reject invalid status | `422 Invalid status` | Passed | Not captured: built-in browser screenshot endpoint unavailable |

Validation note: UI-level validation messages could not be verified visually because the built-in browser automation/screenshot endpoint was unavailable. These validation results are based on live backend/API behavior.

## 6. Frontend-Backend Integration Verification

The frontend is configured to call the backend directly:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_USE_MOCKS=false
```

The following frontend actions were verified against equivalent live backend endpoints:

- Student login triggers `POST /api/auth/login`
- Student registration triggers `POST /api/auth/register`
- Student dashboard triggers `GET /api/student/dashboard`
- Student profile load/save triggers `GET /api/student/profile` and `PUT /api/student/profile`
- University recommendations trigger `GET /api/recommendations/universities`
- Scholarship recommendations trigger `GET /api/recommendations/scholarships`
- Shortlist actions trigger `GET /api/shortlist`, `POST /api/shortlist`, and `DELETE /api/shortlist/:id?entity_type=...`
- Roadmap actions trigger `GET /api/roadmap`, `POST /api/roadmap/generate`, and `PATCH /api/roadmap/milestones/:id`
- Template actions trigger `GET /api/templates` and `GET /api/templates/:id/download`
- Writing assistant actions trigger `POST /api/writing/generate`, `POST /api/writing/:id/refine`, and `PUT /api/writing/:id`
- Admin login triggers `POST /api/admin/auth/login`; alias `POST /api/auth/admin/login` also works
- Admin dashboard triggers `GET /api/admin/dashboard`
- Admin university management triggers `GET/POST/PUT/DELETE /api/admin/universities`
- Admin scholarship management triggers `GET/POST/PUT/DELETE /api/admin/scholarships`
- Admin student management triggers `GET /api/admin/students`, `PATCH /api/admin/students/:id/status`, and `DELETE /api/admin/students/:id`

The official smoke test confirms these API flows can create, update, read, and delete data in the backend JSON database.

## 7. Issues Found

Blocking issues:

- No blocking integration issue found during API-level testing.

Non-blocking but important issues:

- Built-in browser screenshot capability was unavailable in this session, so screenshots could not be captured without violating the user's instruction.
- UI-level validation could not be visually tested because the built-in browser automation endpoint was unavailable.
- Backend accepts script-like full name input during registration.
- Backend accepts invalid student GPA values such as `9.9`.
- Backend accepts negative university tuition values.
- Backend accepts letters in numeric university fields and coerces them to `0`.
- Backend accepts invalid date strings such as `not-a-date`.
- Backend accepts invalid scholarship coverage values such as `Banana`.

## 8. Fixes Made

No application code fixes were made during this testing pass.

The report file itself was created as the requested testing deliverable.

## 9. Final Conclusion

Final verdict: Partially Working.

Core frontend-backend integration is working: both servers can run, frontend is configured for live backend mode, official smoke tests pass, and all major backend-connected CRUD and workflow APIs passed.

The verdict is not marked fully working because several validation rules are missing at the backend/API level, and browser screenshots could not be captured because the required built-in browser screenshot tool was not exposed in this session.

## 10. Commands to Run Again

Backend:

```powershell
cd D:\SAA\saa-project\backend
D:\xamp\php\php.exe -S 127.0.0.1:8000 router.php
```

Frontend:

```powershell
cd D:\SAA\saa-project\frontend
npm.cmd run dev
```

Frontend build:

```powershell
cd D:\SAA\saa-project\frontend
npm.cmd run build
```

Official smoke test:

```powershell
cd D:\SAA\saa-project
powershell -ExecutionPolicy Bypass -File scripts\srs-acceptance-smoke.ps1
```
