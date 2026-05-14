# Frontend Handoff Summary

**From:** Dur-e-Shahwar(Frontend Developer)  
**To:** Hasana Zahid (Backend Developer)  
**Date:** May 2026

---

## What's Built

The complete React frontend is running on **mock data**. Every page, component, and route is fully functional. You can run it with `npm run dev` and see the entire app without any backend.

## What You Need to Build

### 1. Laravel API — 35 Endpoints
All endpoints are documented in `docs/api-contract.md` with exact request/response shapes. The frontend already uses these exact shapes in its service files.

### 2. Database Schema
Based on the API contract, you'll need these tables:
- `users` (id, full_name, email, phone, password, role, status, timestamps)
- `profiles` (user_id, nationality, current_country, current_qualification, gpa, field_of_interest, degree_level, preferred_countries JSON, annual_budget_usd, ielts_score, toefl_score, other_languages, needs_scholarship, target_intake, ranking_preference)
- `universities` (id, name, country, city, ranking, programs JSON, tuition_fee_usd, gpa_requirement, ielts_requirement, application_deadline, degree_levels JSON, website, description, match_score)
- `scholarships` (id, name, provider, funding_country, coverage, eligible_nationalities JSON, eligibility_summary, degree_levels JSON, deadline, details, link)
- `shortlists` (id, user_id, entity_type, entity_id, timestamps)
- `roadmap_milestones` (id, user_id, title, description, suggested_date, deadline, status, order)
- `generated_documents` (id, user_id, document_type, content, word_count, timestamps)

### 3. Authentication
- JWT-based authentication (use `tymon/jwt-auth` or Laravel Sanctum)
- Two roles: `student` and `admin`
- Token in `Authorization: Bearer <token>` header

### 4. CORS
Allow requests from `http://localhost:5173`

## How the Frontend Connects

Every service file in `src/services/` has this pattern:
```javascript
if (import.meta.env.VITE_USE_MOCKS === 'true') {
  // returns mock data
}
// otherwise calls real API via apiClient.js
```

When you're ready to test with the real backend:
1. Set `VITE_USE_MOCKS=false` in `frontend/.env`
2. Ensure `VITE_API_BASE_URL=http://127.0.0.1:8000/api`
3. All API calls will hit your Laravel endpoints

## Key Files to Reference

| File | What It Tells You |
|------|-------------------|
| `docs/api-contract.md` | Every endpoint's request/response shape |
| `src/services/apiClient.js` | How requests are made (headers, auth) |
| `src/services/*.js` | What each page expects from the API |
| `src/mocks/*.js` | Sample data structures for seeding |
| `src/utils/constants.js` | Enum values used across the app |

## Integration Workflow

1. Build endpoints one at a time
2. Test each endpoint with the frontend by setting `VITE_USE_MOCKS=false`
3. Use the `integration/v1` branch for combined testing
4. The frontend expects the exact response shapes in `api-contract.md`

Good luck! 🚀
