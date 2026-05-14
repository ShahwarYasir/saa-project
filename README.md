# Study Abroad Assistant (SAA)

An AI-powered university and scholarship guidance platform for students seeking international education opportunities.

## Team

| Role | Name | Branch |
|------|------|--------|
| Frontend Developer | Hasana Zahid | `frontend/person1` |
| Backend Developer | Dur-e-Shahwar | `backend/person2` |

## Tech Stack

### Frontend
- React 19 + Vite 8
- Bootstrap 5.3.8
- React Router 7
- react-hook-form + yup

### Backend
- PHP 8.5 + Laravel 13
- MySQL 8
- JWT Authentication

## Getting Started

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
# App runs at http://localhost:5173
```

### Backend
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan jwt:secret
php artisan migrate --seed
php artisan serve
# API runs at http://127.0.0.1:8000
```

## Project Structure

```
saa-project/
├── docs/          # API contract, component map, setup guide
├── backend/       # Laravel API (Person 2)
└── frontend/      # React SPA (Person 1)
```

## Branches

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code |
| `frontend/person1` | Frontend development |
| `backend/person2` | Backend development |
| `integration/v1` | Integration testing |

## Mock Mode

The frontend runs in mock mode by default (`VITE_USE_MOCKS=true`). All pages are fully functional with realistic mock data — no backend needed.

### Test Credentials
- **Student**: `student@test.com` / `Test@1234`
- **Admin**: `admin@saa.local` / `Admin@12345`

## License

This project is part of an academic semester project.
