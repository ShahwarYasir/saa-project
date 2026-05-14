# SAA API Contract

Complete API documentation for the Study Abroad Assistant backend.

**Base URL:** `http://127.0.0.1:8000/api`  
**Auth:** JWT Bearer token in `Authorization` header  
**Content-Type:** `application/json`

---

## Authentication

### POST /api/auth/register
**Purpose:** Register a new student account  
**Auth:** Public

**Request Body:**
```json
{
  "full_name": "string, required, min 2 chars",
  "email": "string, required, valid email, unique",
  "phone": "string, required, valid phone",
  "password": "string, required, min 8 chars, 1 uppercase, 1 number, 1 special",
  "password_confirmation": "string, required, must match password"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully. Please login.",
  "data": { "user_id": 1 }
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": { "email": ["The email has already been taken."] }
}
```

---

### POST /api/auth/login
**Purpose:** Authenticate student and return JWT  
**Auth:** Public

**Request Body:**
```json
{
  "email": "string, required",
  "password": "string, required"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "full_name": "Hasana Zahid",
      "email": "student@test.com",
      "phone": "+92 300 1234567",
      "role": "student"
    }
  }
}
```

**Error Response (401):**
```json
{ "success": false, "message": "Invalid email or password", "errors": {} }
```

---

### POST /api/admin/auth/login
**Purpose:** Authenticate admin user  
**Auth:** Public

**Request Body:**
```json
{
  "email": "string, required",
  "password": "string, required"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Admin login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": 100, "full_name": "SAA Admin", "email": "admin@saa.local", "role": "admin" }
  }
}
```

**Error Response (401):**
```json
{ "success": false, "message": "Invalid admin credentials", "errors": {} }
```

---

### GET /api/auth/me
**Purpose:** Get current authenticated user  
**Auth:** Student JWT / Admin JWT

**Success Response (200):**
```json
{
  "success": true,
  "data": { "id": 1, "full_name": "Hasana Zahid", "email": "student@test.com", "role": "student" }
}
```

**Error Response (401):**
```json
{ "success": false, "message": "Unauthenticated" }
```

---

### POST /api/auth/logout
**Purpose:** Invalidate current JWT  
**Auth:** Student JWT / Admin JWT

**Success Response (200):**
```json
{ "success": true, "message": "Logged out successfully" }
```

---

## Student Profile & Dashboard

### GET /api/student/dashboard
**Purpose:** Get student dashboard summary  
**Auth:** Student JWT

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "saved_universities": 4,
    "saved_scholarships": 3,
    "profile_completion": 70,
    "roadmap_progress": 25,
    "recent_activity": [
      { "id": 1, "action": "Saved University of Toronto to shortlist", "time": "2 hours ago", "icon": "bi-bookmark-fill" }
    ]
  }
}
```

---

### GET /api/student/profile
**Purpose:** Get student profile  
**Auth:** Student JWT

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "full_name": "Hasana Zahid",
    "email": "student@test.com",
    "phone": "+92 300 1234567",
    "nationality": "Pakistan",
    "current_country": "Pakistan",
    "current_qualification": "Bachelor's Degree",
    "gpa": 3.45,
    "field_of_interest": "Artificial Intelligence",
    "degree_level": "Master",
    "preferred_countries": ["Germany", "Canada", "United Kingdom"],
    "annual_budget_usd": 12000,
    "ielts_score": 7.0,
    "toefl_score": null,
    "other_languages": "Urdu, Punjabi",
    "needs_scholarship": true,
    "target_intake": "Fall 2027",
    "ranking_preference": "Top 500"
  }
}
```

---

### PUT /api/student/profile
**Purpose:** Update student profile  
**Auth:** Student JWT

**Request Body:**
```json
{
  "nationality": "string",
  "current_country": "string",
  "current_qualification": "string",
  "gpa": "number, 0-4",
  "field_of_interest": "string",
  "degree_level": "string: Bachelor|Master|PhD",
  "preferred_countries": ["string array"],
  "annual_budget_usd": "number",
  "ielts_score": "number, 0-9, nullable",
  "toefl_score": "number, 0-120, nullable",
  "other_languages": "string, nullable",
  "needs_scholarship": "boolean",
  "target_intake": "string, nullable",
  "ranking_preference": "string, nullable"
}
```

**Success Response (200):**
```json
{ "success": true, "message": "Profile updated successfully", "data": { "...updated profile..." } }
```

---

## Recommendations

### GET /api/recommendations/universities
**Purpose:** Get university recommendations (filtered)  
**Auth:** Student JWT

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| country | string | Filter by country |
| degree_level | string | Filter by degree level |
| max_tuition | number | Maximum tuition fee USD |
| min_gpa | number | Student's GPA (show unis with lower req) |
| program | string | Search in program names |

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1, "name": "TU Munich", "country": "Germany", "city": "Munich",
      "ranking": 145, "programs": ["MSc Computer Science"],
      "tuition_fee_usd": 520, "gpa_requirement": 3.0, "ielts_requirement": 6.5,
      "application_deadline": "2027-01-15", "degree_levels": ["Master", "PhD"],
      "match_score": 92, "website": "https://www.tum.de",
      "description": "One of Germany's top technical universities."
    }
  ]
}
```

---

### GET /api/recommendations/scholarships
**Purpose:** Get scholarship recommendations (filtered)  
**Auth:** Student JWT

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| funding_country | string | Filter by funding country |
| degree_level | string | Filter by degree level |
| coverage | string | Filter by coverage type |

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1, "name": "DAAD Scholarships", "provider": "DAAD",
      "funding_country": "Germany", "coverage": "Fully Funded",
      "eligible_nationalities": ["All"],
      "eligibility_summary": "Open to international students...",
      "degree_levels": ["Master", "PhD"],
      "deadline": "2026-10-15", "details": "Monthly stipend...",
      "link": "https://www.daad.de"
    }
  ]
}
```

---

## Shortlist

### GET /api/shortlist
**Purpose:** Get all shortlisted items  
**Auth:** Student JWT

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "universities": [{ "...university object..." }],
    "scholarships": [{ "...scholarship object..." }]
  }
}
```

---

### POST /api/shortlist
**Purpose:** Add item to shortlist  
**Auth:** Student JWT

**Request Body:**
```json
{
  "entity_type": "string: university|scholarship",
  "entity_id": "integer, required"
}
```

**Success Response (201):**
```json
{ "success": true, "message": "Added to shortlist" }
```

**Error Response (409):**
```json
{ "success": false, "message": "Already in shortlist" }
```

---

### DELETE /api/shortlist/{id}
**Purpose:** Remove item from shortlist  
**Auth:** Student JWT

**Success Response (200):**
```json
{ "success": true, "message": "Removed from shortlist" }
```

---

## Application Guides

### GET /api/guides/{entity_type}/{id}
**Purpose:** Get how-to-apply guide for a university or scholarship  
**Auth:** Student JWT

**Path Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| entity_type | string | `university` or `scholarship` |
| id | integer | Entity ID |

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "entity": { "...entity details..." },
    "required_documents": ["Passport", "Transcripts", "IELTS report", "SOP", "Recommendation letters", "CV"],
    "steps": [
      { "order": 1, "title": "Research requirements", "description": "..." }
    ],
    "deadlines": { "application": "2027-01-15", "documents": "2027-01-10" },
    "tips": ["Start early", "Tailor your SOP"],
    "portal_link": "https://..."
  }
}
```

---

## Roadmap

### GET /api/roadmap
**Purpose:** Get student's application roadmap  
**Auth:** Student JWT

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "target_intake": "Fall 2027",
    "milestones": [
      {
        "id": 1, "title": "Finalize University List",
        "description": "Research and shortlist universities.",
        "suggested_date": "2026-08-01", "deadline": "2026-09-15",
        "status": "Done", "order": 1
      }
    ]
  }
}
```

---

### POST /api/roadmap/generate
**Purpose:** Generate a new roadmap based on target intake  
**Auth:** Student JWT

**Request Body:**
```json
{ "target_intake": "string, required, e.g. Fall 2027" }
```

**Success Response (201):**
```json
{ "success": true, "message": "Roadmap generated", "data": { "milestones": ["..."] } }
```

---

### PATCH /api/roadmap/milestones/{id}
**Purpose:** Update milestone status  
**Auth:** Student JWT

**Request Body:**
```json
{ "status": "string: Not Started|In Progress|Done" }
```

**Success Response (200):**
```json
{ "success": true, "message": "Milestone updated" }
```

---

## Templates

### GET /api/templates
**Purpose:** List available document templates  
**Auth:** Student JWT

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Academic CV", "description": "...", "category": "CV", "format": ["pdf", "docx"] }
  ]
}
```

---

### GET /api/templates/{id}/download
**Purpose:** Download a template file  
**Auth:** Student JWT

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| format | string | `pdf` or `docx` |

**Success Response (200):** Binary file download with appropriate Content-Type header.

---

## Writing Assistant

### POST /api/writing/generate
**Purpose:** Generate a document using AI  
**Auth:** Student JWT

**Request Body:**
```json
{
  "document_type": "string: personal_statement|sop|motivation_letter|cover_letter",
  "target_university": "string, required",
  "target_program": "string, required",
  "achievements": "string, required",
  "background": "string, required",
  "word_limit": "integer, 100-2000"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "document_type": "sop",
    "content": "As a passionate computer science graduate...",
    "word_count": 487,
    "created_at": "2026-05-14T10:00:00Z"
  }
}
```

---

### PUT /api/writing/{id}
**Purpose:** Save edited document  
**Auth:** Student JWT

**Request Body:**
```json
{ "content": "string, required" }
```

**Success Response (200):**
```json
{ "success": true, "message": "Document saved" }
```

---

### POST /api/writing/{id}/refine
**Purpose:** Refine a generated document with AI  
**Auth:** Student JWT

**Request Body:**
```json
{ "instructions": "string, required, e.g. Make it more formal" }
```

**Success Response (200):**
```json
{
  "success": true,
  "data": { "id": 1, "content": "...refined content...", "word_count": 520 }
}
```

---

## Admin Endpoints

### GET /api/admin/dashboard
**Purpose:** Get admin dashboard stats  
**Auth:** Admin JWT

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "total_students": 156,
    "total_universities": 10,
    "total_scholarships": 10,
    "active_sessions": 23,
    "recent_registrations": [
      { "id": 1, "full_name": "Hasana Zahid", "email": "hasana@example.com", "registered_at": "2026-05-12", "status": "active" }
    ]
  }
}
```

---

### GET /api/admin/universities
**Purpose:** List all universities  
**Auth:** Admin JWT

**Success Response (200):**
```json
{ "success": true, "data": [{ "...university objects..." }] }
```

---

### POST /api/admin/universities
**Purpose:** Create a university  
**Auth:** Admin JWT

**Request Body:**
```json
{
  "name": "string, required",
  "country": "string, required",
  "city": "string, required",
  "ranking": "integer, required, min 1",
  "programs": ["string array"],
  "tuition_fee_usd": "number, required, min 0",
  "gpa_requirement": "number, required, 0-4",
  "ielts_requirement": "number, required, 0-9",
  "application_deadline": "date string, required",
  "degree_levels": ["string array"],
  "website": "string, valid URL",
  "description": "string"
}
```

**Success Response (201):**
```json
{ "success": true, "message": "University created", "data": { "id": 11, "...university..." } }
```

---

### PUT /api/admin/universities/{id}
**Purpose:** Update a university  
**Auth:** Admin JWT

**Request Body:** Same as POST (all fields optional for partial update)

**Success Response (200):**
```json
{ "success": true, "message": "University updated", "data": { "...updated university..." } }
```

---

### DELETE /api/admin/universities/{id}
**Purpose:** Delete a university  
**Auth:** Admin JWT

**Success Response (200):**
```json
{ "success": true, "message": "University deleted" }
```

---

### GET /api/admin/scholarships
**Purpose:** List all scholarships  
**Auth:** Admin JWT

**Success Response (200):**
```json
{ "success": true, "data": [{ "...scholarship objects..." }] }
```

---

### POST /api/admin/scholarships
**Purpose:** Create a scholarship  
**Auth:** Admin JWT

**Request Body:**
```json
{
  "name": "string, required",
  "provider": "string, required",
  "funding_country": "string, required",
  "coverage": "string, required: Fully Funded|Partial Funding|Stipend Only|Tuition Waiver",
  "eligible_nationalities": ["string array"],
  "eligibility_summary": "string",
  "degree_levels": ["string array"],
  "deadline": "date string, required",
  "details": "string",
  "link": "string, valid URL"
}
```

**Success Response (201):**
```json
{ "success": true, "message": "Scholarship created", "data": { "id": 11, "...scholarship..." } }
```

---

### PUT /api/admin/scholarships/{id}
**Purpose:** Update a scholarship  
**Auth:** Admin JWT

**Request Body:** Same as POST (all fields optional)

**Success Response (200):**
```json
{ "success": true, "message": "Scholarship updated", "data": { "...updated scholarship..." } }
```

---

### DELETE /api/admin/scholarships/{id}
**Purpose:** Delete a scholarship  
**Auth:** Admin JWT

**Success Response (200):**
```json
{ "success": true, "message": "Scholarship deleted" }
```

---

### GET /api/admin/students
**Purpose:** List all student accounts  
**Auth:** Admin JWT

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    { "id": 1, "full_name": "Hasana Zahid", "email": "student@test.com", "status": "active", "registered_at": "2026-05-01" }
  ]
}
```

---

### PATCH /api/admin/students/{id}/status
**Purpose:** Activate or deactivate a student account  
**Auth:** Admin JWT

**Request Body:**
```json
{ "status": "string: active|inactive" }
```

**Success Response (200):**
```json
{ "success": true, "message": "Student activated" }
```

---

### DELETE /api/admin/students/{id}
**Purpose:** Delete a student account  
**Auth:** Admin JWT

**Success Response (200):**
```json
{ "success": true, "message": "Student deleted" }
```

---

## Error Response Format (All Endpoints)

All error responses follow this shape:
```json
{
  "success": false,
  "message": "Human-readable error description",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

**Common HTTP Status Codes:**
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 401 | Unauthenticated |
| 403 | Forbidden (wrong role) |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 422 | Validation Error |
| 500 | Server Error |
