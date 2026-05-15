# SAA Demo Script

Use this script to walk through all features during your project presentation in real API mode.

## Before The Demo

1. Start the PHP backend:

```bash
cd backend
start-server.bat
```

2. Start the React frontend in another terminal:

```bash
cd frontend
npm.cmd run dev
```

3. Confirm `frontend/.env` has:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_USE_MOCKS=false
```

## Demo Credentials

- Student: `student@test.com` / `Test@1234`
- Admin: `admin@saa.local` / `Admin@12345`

## Walkthrough

1. Home Page `/`
Show the hero section, feature cards, and navigation to login/register.

2. Registration `/register`
Fill dummy student data, show inline validation, and register a new account.

3. Student Login `/login`
Use `student@test.com` / `Test@1234`, then show redirect to dashboard.

4. Dashboard `/dashboard`
Show saved universities, saved scholarships, profile completion, roadmap progress, and recent activity loaded from PHP API.

5. Profile Builder `/profile`
Edit profile fields, preferred countries, IELTS/GPA, and save. Mention that data persists in `backend/data/database.json`.

6. Universities `/universities`
Filter by Germany, show match scores, and save/remove a university from shortlist.

7. Scholarships `/scholarships`
Filter by coverage or country, show eligibility details, and save/remove a scholarship.

8. Shortlist `/shortlist`
Show saved university and scholarship tabs. Remove one item and show the list updates.

9. How To Apply `/how-to-apply/university/1`
Show required documents, steps, deadlines, tips, and the official portal link.

10. Writing Assistant `/writing-assistant`
Select a document type, fill context, generate a draft, show the AI disclaimer, then refine it.

11. Templates `/templates`
Download a PDF or DOCX template from the PHP backend.

12. Roadmap `/roadmap`
Change milestone statuses and show progress updates.

13. Admin Login `/admin/login`
Use `admin@saa.local` / `Admin@12345`.

14. Admin Dashboard `/admin`
Show total students, universities, scholarships, active sessions, and recent registrations.

15. Manage Universities `/admin/universities`
Search, add, edit, and delete a university.

16. Manage Scholarships `/admin/scholarships`
Search, add, edit, and delete a scholarship.

17. Manage Students `/admin/students`
Toggle active/inactive status and delete a test student if needed.

18. 404 Page
Navigate to `/anything-random` and show the not found page.

## Key Points To Highlight

- React frontend is integrated with a simple PHP API.
- No Laravel, Composer, or MySQL is required for this phase.
- Auth, student pages, admin pages, downloads, shortlist, and writing assistant are working.
- Demo data is persisted locally in `backend/data/database.json`.
