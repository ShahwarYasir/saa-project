# SAA MySQL Database Setup

The backend now uses MySQL through simple PHP PDO prepared statements. Laravel, Composer, and any PHP framework are not required.

## Database Defaults

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=saa_project
DB_USERNAME=root
DB_PASSWORD=
```

These defaults match a normal XAMPP MySQL/phpMyAdmin setup.

## Setup With phpMyAdmin

1. Start Apache and MySQL from the XAMPP Control Panel.
2. Open phpMyAdmin:

   ```text
   http://localhost/phpmyadmin
   ```

3. Click the SQL tab.
4. Open `backend/database/schema.sql`.
5. Paste the full SQL into phpMyAdmin and run it.
6. Confirm the database `saa_project` exists with these tables:

   - `users`
   - `profiles`
   - `universities`
   - `scholarships`
   - `shortlists`
   - `roadmap_milestones`
   - `templates`
   - `documents`

7. Seed demo data from the project root:

   ```powershell
   D:\xamp\php\php.exe backend\database\seed.php
   ```

   If PHP is available in PATH:

   ```powershell
   php backend\database\seed.php
   ```

## Setup With MySQL CLI

From the project root:

```powershell
D:\xamp\mysql\bin\mysql.exe -u root < backend\database\schema.sql
D:\xamp\php\php.exe backend\database\seed.php
```

If `mysql` and `php` are available in PATH:

```powershell
mysql -u root < backend\database\schema.sql
php backend\database\seed.php
```

## Environment Variables

Copy the backend example environment:

```powershell
cd backend
Copy-Item .env.example .env
```

Required database values:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=saa_project
DB_USERNAME=root
DB_PASSWORD=
```

## Run Backend

```powershell
cd backend
php -S 127.0.0.1:8000 router.php
```

With XAMPP PHP:

```powershell
cd backend
D:\xamp\php\php.exe -S 127.0.0.1:8000 router.php
```

API base URL:

```text
http://127.0.0.1:8000/api
```

## Run Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

For live backend mode, set `frontend/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_USE_MOCKS=false
```

## Demo Credentials

Student:

```text
student@test.com / Test@1234
```

Admin:

```text
admin@saa.local / Admin@12345
```

## Troubleshooting

| Problem | Fix |
|---|---|
| `php` is not recognized | Use `D:\xamp\php\php.exe` or add PHP to PATH. |
| `mysql` is not recognized | Use `D:\xamp\mysql\bin\mysql.exe` or add MySQL to PATH. |
| MySQL connection failed | Start MySQL in XAMPP and confirm `.env` DB values. |
| Unknown database `saa_project` | Import `backend/database/schema.sql` first. |
| Frontend cannot login | Start backend, seed database, and set `VITE_USE_MOCKS=false`. |
| CORS error | Confirm `FRONTEND_URL` includes `http://localhost:5173,http://127.0.0.1:5173`. |
| Duplicate seed data | Run `seed.php`; it resets demo tables to a known state instead of creating duplicates. |
| Port already in use | Stop the old server or use another port and update `VITE_API_BASE_URL`. |
