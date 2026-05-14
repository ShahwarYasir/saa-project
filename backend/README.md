# SAA Backend — Laravel API

This directory will contain the Laravel 13 backend API for the Study Abroad Assistant.

## Owner
**Dur-e-Shahwar** — Backend Developer

## Tech Stack
- PHP 8.5
- Laravel 13
- MySQL 8
- JWT Authentication (tymon/jwt-auth or Laravel Sanctum)

## Setup Instructions

1. Install PHP 8.5 and Composer
2. Install MySQL 8 and create database `saa_db`
3. Copy `.env.example` to `.env`
4. Run:
```bash
composer install
php artisan key:generate
php artisan jwt:secret
php artisan migrate --seed
php artisan serve
```

## API Documentation

See `docs/api-contract.md` for the complete API contract with all 35 endpoints.

## CORS Configuration

The backend must allow requests from `http://localhost:5173` (frontend dev server).
