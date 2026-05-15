# Study Abroad Assistant (SAA) - Frontend Handoff

## Overview
The SAA frontend has been fully rebuilt using React 19, Vite, and Bootstrap 5.3.8. The implementation encompasses a brand-new premium design system spanning three main scopes:
1. **Public Pages**: Homepage, Login, Registration.
2. **Student Portal**: Dashboard, Profile Builder, Universities, Scholarships, Shortlist, and Tools.
3. **Admin Portal**: Admin Dashboard, University/Scholarship/Student Management, and Admin Auth.

Currently, the application runs entirely on **mock services** (enabled via `VITE_USE_MOCKS=true` in the `.env` file). The UI components utilize a custom `useApi` hook to fetch data.

## Backend Integration Requirements
As the backend developer, your primary task is to implement the RESTful API endpoints that the frontend services currently simulate. 

The frontend uses `axios` (or `fetch`) located in `src/services/apiClient.js`. Once you have the backend running, the frontend can be switched to live mode by setting `VITE_USE_MOCKS=false` and updating the `VITE_API_URL`.

Below is the mapping of the required endpoints and their expected payloads, specifically focusing on the newly built Admin Portal.

---

## 1. Authentication & Users
### Endpoints
* **`POST /api/auth/admin/login`**
  * **Payload:** `{ email, password }`
  * **Response:** `{ success: true, data: { token: "...", user: { id, full_name, email, role: "admin" } } }`
* **`POST /api/auth/login`** (Student Login)
* **`POST /api/auth/register`** (Student Registration)

---

## 2. Admin Dashboard
### Endpoints
* **`GET /api/admin/dashboard`**
  * **Response:** 
    ```json
    {
      "success": true,
      "data": {
        "total_students": 156,
        "total_universities": 45,
        "total_scholarships": 20,
        "active_sessions": 23,
        "recent_registrations": [
          { "id": 1, "full_name": "Hasana Zahid", "email": "hasana@example.com", "registered_at": "2026-05-12", "status": "active" }
        ]
      }
    }
    ```

---

## 3. Universities Management
### Endpoints
* **`GET /api/admin/universities`**
  * Returns an array of university objects.
* **`POST /api/admin/universities`** (Create)
* **`PUT /api/admin/universities/:id`** (Update)
* **`DELETE /api/admin/universities/:id`** (Delete)

### Expected Payload / Schema
```json
{
  "name": "Harvard University",
  "country": "USA",
  "city": "Cambridge",
  "ranking": 1,
  "programs": ["Computer Science", "Business", "Engineering"], // Sent as an array of strings
  "gpa_requirement": 3.8, // Float or null
  "tuition_fee_usd": 55000, // Integer or null
  "application_deadline": "2026-12-01", // YYYY-MM-DD
  "portal_url": "https://harvard.edu",
  "description": "..."
}
```

---

## 4. Scholarships Management
### Endpoints
* **`GET /api/admin/scholarships`**
* **`POST /api/admin/scholarships`**
* **`PUT /api/admin/scholarships/:id`**
* **`DELETE /api/admin/scholarships/:id`**

### Expected Payload / Schema
```json
{
  "name": "Global Excellence Scholarship",
  "provider": "Government of Canada",
  "country": "Canada",
  "coverage_type": "Full", // "Full" | "Partial" | "Tuition Only"
  "amount": "$10,000 / year", // Stored as a string describing the amount
  "application_deadline": "2026-09-15", // YYYY-MM-DD
  "portal_url": "https://...",
  "eligibility": "Must have GPA > 3.5..."
}
```

---

## 5. Students Management
### Endpoints
* **`GET /api/admin/students`**
  * **Response Schema expected per student:**
    ```json
    {
      "id": 1,
      "full_name": "John Doe",
      "email": "john@example.com",
      "status": "active", // "active" | "inactive"
      "registered_at": "2026-05-01"
    }
    ```
    *(Note: The frontend "View Profile" modal currently renders mock fallback details like `completion_percentage`, `phone`, `degree`, and `preferred_countries` because the mock service omits them. If you add these to the backend response, the frontend can be trivially updated to map them directly.)*

* **`PATCH /api/admin/students/:id/status`**
  * **Payload:** `{ status: "active" | "inactive" }`
* **`DELETE /api/admin/students/:id`**

---

## Technical Notes for Backend
- **CORS:** Ensure your backend configures CORS appropriately, as the Vite dev server runs on a different port (typically `localhost:5173`).
- **Authentication:** The frontend expects a Bearer token. Ensure your endpoints are protected and validate the JWT token.
- **Error Handling:** The `apiClient.js` service expects a JSON response. If an error occurs, return a `400` or `500` status code with a JSON payload: `{ success: false, message: "Error details here" }`. The frontend intercepts this to display Toast notifications automatically.
- **Pagination & Search:** Currently, search and filtering (by country, name) are handled **client-side** in the frontend components over the entire list array. For large datasets, you may want to migrate this to server-side query parameters in the future (e.g., `?search=Harvard&country=USA`), but for V1, returning the full array is completely fine.
