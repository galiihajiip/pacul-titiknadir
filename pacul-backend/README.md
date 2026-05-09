# PACUL Backend API

Laravel 11 REST API backend for the PACUL (Platform Aksi Kolektif untuk Lingkungan) platform.

## Requirements

- PHP 8.2+
- Composer
- MySQL 8.0+
- Redis

## Quick Start

```bash
# 1. Install dependencies
composer install

# 2. Copy env and generate key
cp .env.example .env
php artisan key:generate

# 3. Configure database in .env, then migrate + seed
php artisan migrate
php artisan db:seed

# 4. Link storage
php artisan storage:link

# 5. Start dev server
php artisan serve
```

## Environment Variables

| Variable | Description |
|---|---|
| `DB_DATABASE` | MySQL database name |
| `FRONTEND_URL` | Next.js frontend URL (for CORS) |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key (reverse geocoding) |
| `GOOGLE_VISION_CREDENTIALS` | Path to Google Cloud Vision JSON credentials |
| `VAPID_PUBLIC_KEY` | Web Push VAPID public key |
| `VAPID_PRIVATE_KEY` | Web Push VAPID private key |
| `VAPID_SUBJECT` | VAPID subject (mailto:) |

Generate VAPID keys:
```bash
php artisan webpush:vapid
```

## API Routes Summary

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login (citizen) |
| POST | `/api/auth/gov/login` | Login (government) |
| GET | `/api/carbon/emissions` | List emissions |
| POST | `/api/carbon/add` | Add emission |
| POST | `/api/ocr/scan-bill` | OCR electricity bill |
| GET | `/api/eco-action/challenges` | List challenges |
| POST | `/api/eco-action/upload` | Upload proof |
| POST | `/api/steps/save` | Save step session |
| GET | `/api/vouchers` | List vouchers |
| POST | `/api/vouchers/{id}/redeem` | Redeem voucher |
| GET | `/api/waste-reports` | List waste reports |
| POST | `/api/waste-reports` | Submit report |
| POST | `/api/waste-reports/{id}/upvote` | Toggle upvote |
| GET | `/api/government/reports` | Gov: all reports |
| PUT | `/api/government/reports/{id}/status` | Gov: update status |
| GET | `/api/government/dashboard-stats` | Gov: KPI stats |
| GET | `/api/government/reports/export` | Gov: export CSV |
| GET | `/api/sse/stream` | Server-Sent Events stream |
| POST | `/api/push/subscribe` | Register push subscription |

## XP Actions

| Action | XP |
|---|---|
| `register` | 50 |
| `daily_login` | 5 |
| `add_emission` | 25 |
| `upload_proof` | 50 |
| `waste_report` | 50 |
| `waste_report_resolved` | 100 |
| `post_collaboration` | 10 |
| `step_milestone_1000` | 10 |
| `step_milestone_5000` | 50 |
| `step_milestone_10000` | 100 |
| `electricity_sangat_hemat` | 200 |
| `first_scan` | 30 |

## Government Demo Accounts

| Email | Password | Unit |
|---|---|---|
| `admin@pacul.gov.id` | `pacul_admin_2024` | PACUL Platform |
| `budi@surabaya.go.id` | `surabaya2024` | Dinas Kebersihan |
| `siti@surabaya.go.id` | `surabaya2024` | BPLHD Surabaya |
