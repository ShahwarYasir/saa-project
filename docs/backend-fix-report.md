# Backend Fix Report

Date: 2026-05-15

## What Was Broken

- Profile Builder saves did not return backend profile completion metadata and did not accept the frontend GPA payload alias (`gpa_value` / `gpa_mode`).
- Writing Assistant backend required a `background` field that the frontend never sends, causing valid Generate Document requests to fail with validation errors.
- Document Templates backend only seeded five templates and had no preview endpoint for backend consumers.
- DOCX generation depended on `ZipArchive` fallback behavior that could return plain text under a DOCX content type if the extension was unavailable.

## Files Changed

- `backend/src/app.php`
- `frontend/src/pages/student/ProfileBuilderPage.jsx`
- `frontend/src/pages/student/TemplatesPage.jsx`
- `frontend/src/services/templateService.js`
- `docs/backend-fix-report.md`

Existing SQL backend files used during testing:

- `backend/src/db.php`
- `backend/database/schema.sql`

## SQL/Database Changes Made

- No schema change was required.
- Seed/demo synchronization now ensures all nine required templates exist in the SQL `templates` table.
- Profile save continues to persist through SQL-backed `profiles` and `users` tables.
- Writing Assistant generation saves generated documents to the SQL `documents` table.

## Endpoints Fixed

- `PUT /api/student/profile`
  - Accepts frontend payload fields including `gpa_value` and `gpa_mode`.
  - Creates or updates the user profile.
  - Returns `success`, `message`, `data`, and `profile_completion`.

- `GET /api/templates`
  - Returns all nine required templates.

- `GET /api/templates/{id}/preview`
  - Returns valid preview content.

- `GET /api/templates/{id}/download?format=pdf`
  - Returns non-empty PDF content with `Content-Type: application/pdf`.

- `GET /api/templates/{id}/download?format=docx`
  - Returns non-empty DOCX content with `Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document`.

- `POST /api/writing/generate`
  - Accepts the exact frontend payload: `document_type`, `target_university`, `target_program`, `achievements`, `why_university`, `career_goals`, `word_count`.
  - Uses local template-based generation, no external AI API.
  - Saves generated content in SQL `documents`.
  - Returns generated content, id, title, type, word count, and created date.

## Validation Added

- Profile:
  - GPA/GPA alias must be numeric and valid.
  - Percentage GPA mode is accepted and converted to a 4.0 scale.
  - Budget must be numeric.
  - IELTS must be 0-9.
  - TOEFL must be 0-120.
  - Phone/name validation included when sent.

- Writing:
  - Missing required fields return HTTP 422.
  - Unsupported document types return HTTP 422.
  - Invalid word count format/range returns HTTP 422.

## Test Commands Run

- `D:\xamp\php\php.exe -l backend\src\app.php`
- `D:\xamp\php\php.exe -l backend\src\db.php`
- `D:\xamp\php\php.exe -l backend\database\seed.php`
- `D:\xamp\php\php.exe -r "require 'backend/src/app.php'; print json_encode(saa_mysql_counts(), JSON_PRETTY_PRINT);"`
- Local PHP server API smoke tests with `Invoke-RestMethod` / `Invoke-WebRequest`
- `npm.cmd run build`

## Test Results

- PHP syntax checks: passed.
- SQL connection/count test: passed.
- Profile valid save: passed, returned `profile_completion: 100`.
- Profile invalid GPA, budget, IELTS, TOEFL: all returned HTTP 422.
- Templates:
  - All nine previews returned non-empty content.
  - All nine PDFs returned `application/pdf`, non-empty files, `%PDF-1.4` header.
  - All nine DOCX downloads returned the DOCX MIME type, non-empty files, `PK` ZIP header.
- Writing Assistant:
  - Frontend example payload generated successfully.
  - Generated content includes professional resilience framing.
  - Document saved in SQL `documents`.
  - Missing fields and invalid word count returned HTTP 422.

## Frontend Modification Check

- Frontend changes were limited to functionality only.
- No colors, icons, CSS, routes, layout, or visible design styling were changed.
- `ProfileBuilderPage.jsx` now preserves step 1 and step 2 data across React re-renders before final save.
- `TemplatesPage.jsx` now calls the existing backend template download service instead of showing only a local success toast.
- `templateService.js` now uses the same API base URL fallback as the other frontend services and normalizes `PDF`/`DOCX` to backend `pdf`/`docx`.

## Remaining Issues

- The in-app Browser automation tool required by the Browser skill was not exposed in this session, so I could not complete a click-through using that specific tool.
- Backend API testing was completed against real local PHP/MySQL endpoints.
- No known backend blocker remains for Profile Builder, Document Templates, or Writing Assistant.
