# SRS Acceptance Report

Date: May 14, 2026  
Phase: 4 - SRS Acceptance Testing and Final Presentation Preparation  
Mode tested: React frontend configured for real PHP API (`VITE_USE_MOCKS=false`)

## Result

Status: **Accepted for demo preparation**

The implemented system covers the semester SRS scope: authentication, profile builder, rule-based recommendations, shortlist, how-to-apply guide, roadmap, templates, writing assistant, and admin management.

## Automated Evidence

Command:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\srs-acceptance-smoke.ps1
```

Result:

```text
SRS acceptance smoke test passed.
```

Additional frontend check:

```powershell
cd frontend
npm.cmd run build
```

Result:

```text
vite build completed successfully
```

## SRS Feature Checklist

| SRS Area | Implementation Evidence | Status |
|---|---|---|
| Student registration | `POST /api/auth/register` tested with a unique user | Pass |
| Student login | `student@test.com` login tested | Pass |
| Admin login | `admin@saa.local` login tested | Pass |
| JWT/Bearer auth | Protected `/auth/me`, dashboard, admin routes tested | Pass |
| Student dashboard | `/api/student/dashboard` returns summary stats | Pass |
| Profile builder | Profile load/save tested through `/api/student/profile` | Pass |
| University recommendations | Germany filter returned matching universities | Pass |
| Scholarship recommendations | Fully Funded filter returned matching scholarships | Pass |
| Shortlist | Add, list, and remove university tested | Pass |
| How-to-apply guide | University guide returned documents, steps, and portal link | Pass |
| Roadmap | Load roadmap and update milestone status tested | Pass |
| Templates | Template list and PDF download tested | Pass |
| Writing assistant | Generate, refine, and save draft tested | Pass |
| Admin dashboard | Admin stats route tested | Pass |
| Admin university CRUD | Create, update, delete tested | Pass |
| Admin scholarship CRUD | Create, update, delete tested | Pass |
| Admin student management | List, status update, and delete test student tested | Pass |

## Tested Output Summary

```text
Setup/API health: Pass
Auth: Pass
Student dashboard/profile: Pass
Recommendations: Pass
Shortlist: Pass
Guide: Pass
Roadmap: Pass
Templates/download: Pass
Writing assistant: Pass
Admin dashboard/CRUD: Pass
Frontend production build: Pass
```

## Demo Accounts

The backend auto-restores required demo users if they are removed during testing:

- Student: `student@test.com` / `Test@1234`
- Admin: `admin@saa.local` / `Admin@12345`

## Known Limitations

- The backend now uses MySQL/MariaDB through simple PHP PDO prepared statements.
- The writing assistant uses a local generated draft/refine fallback, not a paid AI provider.
- Email/SMS reminders, external application submission, visa guidance, and mobile app features are outside the accepted semester demo scope.
- Final screenshots must still be captured manually from the browser for the presentation slides/report.
