# SAA Frontend

React + Vite frontend for the Study Abroad Assistant full-stack project.

The frontend contains the public website, protected student portal, and protected admin portal. It can run against mock data for UI-only work, but the final project configuration is live API mode with the PHP/MySQL backend.

## Final Status

Status: Final integrated frontend.

Verified in live mode with:

- `VITE_USE_MOCKS=false`
- Backend API at `http://127.0.0.1:8000/api`
- Vite dev server at `http://127.0.0.1:5173`
- Student and admin authentication through backend bearer tokens
- Dashboard, profile, recommendations, shortlist, roadmap, templates, writing assistant, and admin pages connected to backend APIs
- Production build passing with `npm.cmd run build`

## Tech Stack

- React 19
- Vite 8
- React Router 7
- Bootstrap 5
- Bootstrap Icons
- React Hook Form
- Yup
- Vitest

## Environment

Create a local `.env` file:

```powershell
cd frontend
Copy-Item .env.example .env
```

Final full-stack configuration:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_APP_NAME=Study Abroad Assistant
VITE_USE_MOCKS=false
```

Mock UI-only mode:

```env
VITE_USE_MOCKS=true
```

Restart Vite after changing `.env`.

## Install

```powershell
cd frontend
npm install
```

## Run

Start the backend first, then run:

```powershell
cd frontend
npm.cmd run dev -- --host 127.0.0.1
```

Open:

```text
http://127.0.0.1:5173
```

If npm is configured normally in your terminal, this also works:

```powershell
npm run dev
```

## Build

```powershell
cd frontend
npm.cmd run build
```

Build output is written to:

```text
frontend/dist/
```

## Test

```powershell
cd frontend
npm.cmd test -- --run
```

At final handoff, Vitest is installed but there are no committed test files, so this command exits with "No test files found." Use the root full-stack smoke scripts for project verification.

## Demo Credentials

Student:

```text
student@test.com
Test@1234
```

Admin:

```text
admin@saa.local
Admin@12345
```

## Routes

Public routes:

| Route | Page |
|---|---|
| `/` | Home |
| `/login` | Student login |
| `/register` | Student registration |
| `/admin/login` | Admin login |

Student routes:

| Route | Page |
|---|---|
| `/dashboard` | Dashboard |
| `/profile` | Profile builder |
| `/universities` | University recommendations |
| `/scholarships` | Scholarship recommendations |
| `/shortlist` | Saved universities and scholarships |
| `/how-to-apply/:type/:id` | Application guide |
| `/writing-assistant` | Writing assistant |
| `/roadmap` | Application roadmap |
| `/templates` | Document templates |

Admin routes:

| Route | Page |
|---|---|
| `/admin` | Admin dashboard |
| `/admin/universities` | Manage universities |
| `/admin/scholarships` | Manage scholarships |
| `/admin/students` | Manage students |

## Feature Summary

Student portal:

- Live dashboard stats from backend profile, shortlist, and roadmap data
- Three-step profile builder with backend-normalized profile save
- University recommendations with backend match scoring and shortlist state
- Scholarship recommendations with shortlist state
- Shortlist list/remove flow with confirmation
- Roadmap generation and milestone status tracking
- Template listing and backend download endpoint
- Writing assistant generation, refinement, copy, and text download

Admin portal:

- Admin login
- Dashboard statistics
- University CRUD
- Scholarship CRUD
- Student list, status update, and delete actions

## Project Structure

```text
frontend/
|-- docs/screenshots/          # UI screenshots used by docs
|-- public/                    # Static public assets
|-- src/
|   |-- components/            # Reusable UI components
|   |-- context/               # Auth and toast contexts
|   |-- hooks/                 # Shared hooks
|   |-- mocks/                 # Mock data for UI-only mode
|   |-- pages/                 # Public, student, and admin pages
|   |-- routes/                # App route configuration
|   |-- services/              # API clients and endpoint wrappers
|   |-- styles/                # Global styles and design tokens
|   |-- utils/                 # Validators, constants, helpers
|   |-- App.jsx
|   `-- main.jsx
|-- package.json
|-- vite.config.js
`-- README.md
```

## API Integration

The frontend uses `src/services/apiClient.js` for JSON requests. It reads the bearer token from:

```text
localStorage.saa_access_token
```

Important environment value:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Main service files:

- `src/services/authService.js`
- `src/services/profileService.js`
- `src/services/recommendationService.js`
- `src/services/shortlistService.js`
- `src/services/roadmapService.js`
- `src/services/templateService.js`
- `src/services/writingService.js`
- `src/services/adminService.js`

## Final Integration Notes

- Mock mode is no longer the default in `.env.example`.
- Dashboard stats prefer backend values and only use local storage as fallback.
- Profile builder stores the backend-normalized profile after save.
- University and scholarship cards initialize saved state from backend `is_shortlisted`.
- Roadmap progress is synced for dashboard display.
- Writing assistant uses zero-based UI steps correctly after generation.

## Troubleshooting

| Problem | Fix |
|---|---|
| Login fails | Confirm backend is running at `http://127.0.0.1:8000/api`. |
| Network/CORS error | Confirm backend `FRONTEND_URL` includes `http://127.0.0.1:5173`. |
| Old token keeps failing | Clear browser local storage and login again. |
| Dashboard shows zero data | Confirm `.env` has `VITE_USE_MOCKS=false` and backend seed data exists. |
| PowerShell blocks npm | Use `npm.cmd` instead of `npm`. |
| Port 5173 is busy | Stop the existing Vite process or run Vite on another port. |

## Screenshots

Screenshots are stored in:

```text
frontend/docs/screenshots/
```

They are used by the project documentation and presentation materials.
