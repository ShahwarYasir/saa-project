# SAA Demo Script

Use this script to walk through all features during your project presentation.

---

## 1. Home Page (/)
- Show the hero section with "Your Gateway to Global Education"
- Point out the 4 feature cards
- Click "Get Started Free" → goes to Register

## 2. Registration (/register)
- Fill in dummy data and show inline validation
- Show password requirements (uppercase, number, special char)
- Submit → redirected to Login with success toast

## 3. Student Login (/login)
- Enter: **student@test.com** / **Test@1234**
- Click Sign In → redirected to Dashboard

## 4. Dashboard (/dashboard)
- Show 4 stat cards (Universities, Scholarships, Profile %, Roadmap %)
- Show Quick Actions panel
- Show Recent Activity list

## 5. Profile Builder (/profile)
- Show the live completion percentage bar
- Fill in a few fields — watch the bar update in real-time
- Show the multi-select for Preferred Countries
- Click Save Profile

## 6. Universities (/universities)
- Show the filter sidebar
- Filter by Country: Germany — watch results update
- Click heart button on a university card (show save toggle)
- Point out: ranking badge, match score, tuition, GPA requirement

## 7. Scholarships (/scholarships)
- Show filter by Coverage: "Fully Funded"
- Point out: eligibility, deadline, coverage badge
- Click "Apply" button on a card → opens external link

## 8. Shortlist (/shortlist)
- Show saved universities tab
- Show saved scholarships tab
- Click "How to Apply" on a saved university
- Click Remove button

## 9. How to Apply (/how-to-apply/university/1)
- Show the structured guide sections
- Walk through the document checklist
- Show step-by-step process
- Show tips section
- Click "Visit Official Application Portal"

## 10. Writing Assistant (/writing-assistant)
- **Step 1:** Select "Statement of Purpose"
- **Step 2:** Fill in context form (target university, program, etc.)
- **Step 3:** Show generated document
- **IMPORTANT:** Point out the AI disclaimer box
- Show Copy and Download buttons
- Show Refine feature

## 11. Templates (/templates)
- Show the 5 template cards
- Click PDF download → "coming soon" toast
- Explain these will be real downloads when backend is ready

## 12. Roadmap (/roadmap)
- Show the progress bar with milestone counts
- Change a milestone status from "Not Started" to "In Progress"
- Watch the timeline indicator update
- Change to "Done" — progress bar updates live

## 13. Logout
- Click Logout in sidebar → redirected to Login

## 14. Admin Login (/admin/login)
- Enter: **admin@saa.local** / **Admin@12345**
- Show the default credentials hint

## 15. Admin Dashboard (/admin)
- Show stats: Total Students, Universities, Scholarships
- Show recent registrations table

## 16. Manage Universities (/admin/universities)
- Show search functionality
- Click "Add University" → show modal form
- Click Edit on a row → show pre-filled form
- Click Delete → confirm dialog

## 17. Manage Scholarships (/admin/scholarships)
- Same as universities — show Add/Edit/Delete

## 18. Manage Students (/admin/students)
- Show student table with status column
- Toggle activate/deactivate
- Show search by name/email

## 19. 404 Page
- Navigate to /anything-random
- Show the styled 404 page

---

## Key Points to Highlight
- ✅ All 17 pages fully functional with mock data
- ✅ No backend dependency for demo
- ✅ 35 API endpoints documented for backend team
- ✅ Responsive design — show on mobile width
- ✅ Form validation with inline errors
- ✅ AI disclaimer prominently displayed
- ✅ Clean, professional academic theme
