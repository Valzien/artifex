# Artifex Backend

Laravel REST API untuk platform marketplace digital Artifex.

## Tech Stack

- **Framework:** Laravel 13
- **Auth:** Sanctum (Bearer Token)
- **Database:** MySQL 8.4
- **ORM:** Eloquent

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
# Buat database 'artifex' di MySQL
php artisan migrate:fresh --seed
php artisan serve
```

## Struktur

| Path | Deskripsi |
|------|-----------|
| `app/Http/Controllers/Api/` | 30+ controllers (Public, Client, Freelancer, Admin) |
| `app/Models/` | 17 Eloquent models |
| `database/migrations/` | 22 migration files |
| `database/seeders/` | 11 seeders |
| `routes/api.php` | ~83 API endpoints |

## API Endpoints

### Auth (4)
`POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/user`

### Public (12)
Categories, Services, Products, Freelancers, FAQ

### Client (27)
Dashboard, Profile, Settings, Orders, Favorites, Notifications, Transactions, Chat, Checkout, Cart, Product Checkout

### Freelancer (31)
Dashboard, Services CRUD, Products CRUD, Portfolio CRUD, Orders, Earnings, Reviews, Analytics, Chat, Settings

### Admin (11)
Dashboard, Users CRUD, Services, Orders, Analytics

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@artifex.id | password |
| Client | rizky@artifex.id | password |
| Freelancer | rina@artifex.id | password |

## License

Private
