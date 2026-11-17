# JavaPack Travel Gear Rental - RESTful API

A RESTful API for the **JavaPack** travel gear rental platform (Public Website & Admin CMS), built with Express.js Layered Architecture, Sequelize ORM, MySQL, JWT authentication, Role-Based Access Control (RBAC), WIB (`Asia/Jakarta`) native timezone handling, and global Soft Delete (`paranoid: true`).

---

## Tech Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js 4.x
- **ORM**: Sequelize 6.x (`sequelize-cli`)
- **Database**: MySQL 8.0+ (`mysql2`)
- **Authentication**: JWT (`jsonwebtoken`) & password hashing (`bcryptjs`)
- **HTTP Client**: Axios (Payment Gateway & n8n Webhook integration)
- **Architecture**: Layered (`Routes -> Middlewares -> Controllers -> Services -> Models`)

---

## Getting Started

### 1. Navigate to Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration (`.env`)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Ensure your database, base URLs, and integration variables in `.env` match your local environment:
```env
NODE_ENV=development
PORT=5000
TZ=Asia/Jakarta

APP_BASE_URL=http://localhost:5000
API_PREFIX=/api/v1
CLIENT_URL=http://localhost:3000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=javapack_db
DB_USER=root
DB_PASSWORD=
DB_DIALECT=mysql

JWT_SECRET=javapack_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=1d

PAYMENT_GATEWAY_BASE_URL=https://app.sandbox.midtrans.com
PAYMENT_GATEWAY_SERVER_KEY=your_payment_gateway_server_key
N8N_WEBHOOK_URL=http://localhost:5678/webhook/javapack-order
```

### 4. Create Database, Run Migrations & Seeders
Create the MySQL database if it does not exist yet:
```bash
npx sequelize-cli db:create
```

Run migrations and seeders (creates 8 tables with `deleted_at` soft-delete support, seeds 1 admin account, and seeds 11 records each for `hero_banners`, `categories`, `pickup_locations`, `products`, `faqs`, `contact_messages`, and `orders`):
```bash
npm run migrate
npm run seed
```

To undo all migrations, re-migrate, and re-seed from scratch:
```bash
npm run reset
```

### 5. Start Local Development Server
```bash
npm run dev
```
The backend API is now running at: `http://localhost:5000` (API prefix: `/api/v1`).

---

## Demo Account for Testing

| Role | Demo Email | Password | Primary Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gmail.com` | `password` | Full CRUD for Hero Banners, Categories, Pickup Locations, Products, FAQs, and Admin Dashboard |
| **Customer** | *(Register via `/api/v1/auth/register`)* | *(User-defined)* | Browse public catalog, create/update/cancel `pending_payment` orders |

---

## Postman API Documentation

A complete Postman Collection (v2.1.0) is included at `javapack_postman_collection.json`:

1. Open **Postman** and click **Import**.
2. Select `backend/javapack_postman_collection.json`.
3. Run **2. Authentication -> Login (Admin)** (or **Login (Customer)**) first — the test script automatically saves the JWT into the `{{token}}` collection variable for all protected endpoints.
4. Collection variable `{{base_url}}` defaults to `http://localhost:5000/api/v1`.

---

## Standardized API Response & Conventions

- **Consistent Envelope:** Every endpoint returns `success`, `statusCode`, `message` (English), and `data` (or `errors`):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Products retrieved successfully",
    "data": {
      "items": [],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 11,
        "totalPages": 2
      }
    }
  }
  ```
- **Pagination:** All list endpoints accept `?page=1&limit=10` and return `{ items, pagination }`.
- **Soft Delete:** All tables use `deleted_at` with Sequelize `paranoid: true`. `DELETE` endpoints perform soft deletes and list/detail endpoints automatically exclude soft-deleted records.
- **Concurrency Safety:** Order creation, update, and cancellation use `sequelize.transaction()` with pessimistic row locking (`LOCK.UPDATE`) to prevent overselling stock.

