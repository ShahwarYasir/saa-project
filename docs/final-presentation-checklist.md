# Final Presentation Checklist

Use this checklist after the SRS acceptance smoke test passes and after the frontend developer finalizes the UI.

## Start The App

Backend:

```powershell
cd D:\SAA\saa-project\backend
.\start-server.bat
```

Frontend:

```powershell
cd D:\SAA\saa-project\frontend
.\start-dev.bat
```

Open:

```text
http://localhost:5173
```

## Required Demo Accounts

- Student: `student@test.com` / `Test@1234`
- Admin: `admin@saa.local` / `Admin@12345`

## Screenshot List

Screenshots are pending until the frontend UI is final. Capture these for the final report or slides:

1. Home page
2. Student login
3. Student dashboard
4. Profile builder
5. University recommendations with a country filter
6. Scholarship recommendations with a coverage filter
7. Shortlist page
8. How-to-apply guide
9. Writing assistant generated draft with disclaimer visible
10. Templates page
11. Roadmap page
12. Admin login
13. Admin dashboard
14. Admin universities table
15. Admin scholarships table
16. Admin students table

## Live Demo Flow

1. Show home page.
2. Login as student.
3. Show dashboard stats from PHP API.
4. Open profile builder and save profile.
5. Filter universities by Germany.
6. Save and remove a university from shortlist.
7. Open how-to-apply guide.
8. Generate and refine a writing assistant draft.
9. Download a template PDF.
10. Update a roadmap milestone.
11. Logout.
12. Login as admin.
13. Add/edit/delete one test university.
14. Add/edit/delete one test scholarship.
15. Show student management.

## Before Submission

- Run `powershell -ExecutionPolicy Bypass -File scripts\srs-acceptance-smoke.ps1`.
- Run `cd frontend` then `npm.cmd run build`.
- Confirm screenshots are included in slides/report.
- Mention that the backend is simple PHP, not Laravel.
- Mention JSON persistence is used for demo simplicity.
