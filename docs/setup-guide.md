# SAA Setup Guide

## Prerequisites

- **Node.js** 18+ (for frontend)
- **PHP** 8.5+ (for backend)
- **Composer** 2+ (for backend)
- **MySQL** 8+ (for backend)
- **Git** (version control)

---

## Frontend Setup

### 1. Navigate to frontend directory
```bash
cd frontend
```

### 2. Copy environment file
```bash
cp .env.example .env
```

### 3. Install dependencies
```bash
npm install
```

### 4. Start development server
```bash
npm run dev
```

App runs at **http://localhost:5173**

### 5. Mock Mode
By default, `VITE_USE_MOCKS=true` in `.env`. This means all API calls return mock data — no backend needed.

### Test Credentials (Mock Mode)
- **Student:** student@test.com / Test@1234
- **Admin:** admin@saa.local / Admin@12345

### Switching to Real API
Set `VITE_USE_MOCKS=false` in `.env` and ensure `VITE_API_BASE_URL` points to the running Laravel backend.

---

## Backend Setup

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Install PHP dependencies
```bash
composer install
```

### 3. Configure environment
```bash
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
```

### 4. Create MySQL database
```sql
CREATE DATABASE saa_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. Run migrations and seeders
```bash
php artisan migrate --seed
```

### 6. Start server
```bash
php artisan serve
```

API runs at **http://127.0.0.1:8000**

---

## Connecting Frontend to Backend

1. Set `VITE_USE_MOCKS=false` in `frontend/.env`
2. Ensure `VITE_API_BASE_URL=http://127.0.0.1:8000/api`
3. Configure CORS in Laravel to allow `http://localhost:5173`
4. Restart frontend dev server

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| npm install fails | Delete `node_modules` and `package-lock.json`, then retry |
| CORS errors | Check Laravel CORS config allows frontend URL |
| JWT errors | Run `php artisan jwt:secret` |
| Database connection | Verify MySQL credentials in `.env` |
