# E-commerce Backend (Node.js + Express + MongoDB)

Standalone REST API backend for an e-commerce project — designed to work with **two separate React frontends** (customer site + admin dashboard). Deployable on Render / Railway.

## Tech Stack

- Node.js + Express
- MongoDB (Mongoose, MongoDB Atlas)
- bcryptjs — password hashing
- jsonwebtoken — JWT auth
- cors — multi-origin CORS (from env)

## Folder Structure

```
backend/
  server.js            # Express app entry
  seed.js              # Admin + 9 sample products seeder
  config/
    db.js              # MongoDB connection
  models/
    Product.js
    Order.js
    User.js
    Admin.js
  routes/
    productRoutes.js
    orderRoutes.js
    authRoutes.js
    adminRoutes.js
  controllers/
    productController.js
    orderController.js
    authController.js
    adminController.js
  middleware/
    auth.js            # JWT verification
    isAdmin.js         # Admin role check
    errorHandler.js    # 404 + centralized error handler
    errorResponse.js   # ErrorResponse class
  .env.example
```

## Setup

```bash
cd backend
npm install

# 1) Create .env from example
cp .env.example .env      # (Windows PowerShell: Copy-Item .env.example .env)

# 2) Fill in .env values (MongoDB Atlas URI, JWT_SECRET, admin credentials)

# 3) Seed admin + sample products
npm run seed

# 4) Run in dev mode (nodemon)
npm run dev

# Production
npm start
```

### Environment Variables (.env)

| Variable         | Description                                           |
| ---------------- | ----------------------------------------------------- |
| PORT             | Server port (default 5000)                            |
| MONGO_URI        | MongoDB Atlas connection string                       |
| JWT_SECRET       | Secret for signing JWTs                               |
| JWT_EXPIRES_IN   | Token expiry (optional, default `7d`)                 |
| ALLOWED_ORIGINS  | Comma-separated list of allowed frontend origins      |
| ADMIN_EMAIL      | Admin account email (used by seed script)             |
| ADMIN_PASSWORD   | Admin account password (used by seed script)          |

## Response Format

Every route returns a consistent shape:

```json
{
  "success": true,
  "data": { ... },
  "message": "..."
}
```

Errors return `{ "success": false, "data": null, "message": "error detail" }` with proper HTTP status codes (400 validation, 401 auth, 403 forbidden, 404 not found, 500 server).

## Authentication

- Send JWT in header: `Authorization: Bearer <token>`
- Customer tokens have `role: "customer"`, admin tokens have `role: "admin"`.
- Admin routes require both valid JWT and `role === 'admin'`.

---

## API Endpoints

### Public

#### `GET /api/health`

**Response:**
```json
{ "success": true, "data": null, "message": "API is running" }
```

#### `GET /api/products`

Query params: `category`, `minPrice`, `maxPrice`, `sort` (`price-asc`, `price-desc`, `newest`, `title`, `rating`), `page`, `limit` (default 12, max 100).

**Example:** `GET /api/products?category=T-shirts&minPrice=100&maxPrice=200&sort=price-asc&page=1&limit=5`

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "65f...",
        "title": "Black Striped T-shirt",
        "price": 120,
        "oldPrice": 150,
        "discount": "20% off",
        "rating": 4.2,
        "image": "https://...",
        "category": "T-shirts",
        "stock": 30,
        "description": "Everyday black tee...",
        "createdAt": "2026-10-30T10:00:00.000Z"
      }
    ],
    "pagination": { "page": 1, "limit": 5, "total": 5, "totalPages": 1 }
  },
  "message": "Products fetched successfully"
}
```

#### `GET /api/products/:id`

**Response:**
```json
{ "success": true, "data": { "product": { ... } }, "message": "Product fetched successfully" }
```

#### `POST /api/orders` — place order

**Request body:**
```json
{
  "items": [
    { "productId": "65f...", "quantity": 2 },
    { "productId": "65a...", "quantity": 1 }
  ],
  "customerInfo": {
    "name": "Ali Khan",
    "email": "ali@example.com",
    "phone": "+923001234567",
    "address": "House 12, Street 4, Karachi"
  },
  "paymentMethod": "cod"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "order": {
      "_id": "661...",
      "items": [
        { "productId": "65f...", "title": "Black Striped T-shirt", "price": 120, "quantity": 2, "image": "https://..." }
      ],
      "customerInfo": { "name": "Ali Khan", "email": "ali@example.com", "phone": "+923001234567", "address": "House 12, Street 4, Karachi" },
      "paymentMethod": "cod",
      "totalAmount": 240,
      "status": "pending",
      "createdAt": "2026-10-30T10:05:00.000Z"
    }
  },
  "message": "Order placed successfully"
}
```

> Prices/titles are taken from the database at order time; client-sent prices are ignored.

#### `POST /api/auth/register`

**Request body:** `{ "name": "Ali", "email": "ali@example.com", "password": "secret123" }`

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "65f...", "name": "Ali", "email": "ali@example.com" },
    "token": "eyJhbGci..."
  },
  "message": "Registration successful"
}
```

#### `POST /api/auth/login`

**Request body:** `{ "email": "ali@example.com", "password": "secret123" }`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": { "id": "65f...", "name": "Ali", "email": "ali@example.com" },
    "token": "eyJhbGci..."
  },
  "message": "Login successful"
}
```

### Admin (JWT + admin role required)

#### `POST /api/admin/login`

**Request body:** `{ "email": "admin@example.com", "password": "admin123456" }`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "admin": { "id": "661...", "email": "admin@example.com" },
    "token": "eyJhbGci..."   // JWT contains role: "admin"
  },
  "message": "Admin login successful"
}
```

#### `POST /api/products` *(auth: admin)*

**Request body:**
```json
{
  "title": "New Tee",
  "price": 99,
  "oldPrice": 130,
  "discount": "25% off",
  "rating": 4.5,
  "image": "https://...",
  "category": "T-shirts",
  "stock": 40,
  "description": "Brand new tee."
}
```

**Response (201):**
```json
{ "success": true, "data": { "product": { ... } }, "message": "Product created successfully" }
```

#### `PUT /api/products/:id` *(auth: admin)*

Any subset of product fields. **Response:** `{ "success": true, "data": { "product": {...} }, "message": "Product updated successfully" }`

#### `DELETE /api/products/:id` *(auth: admin)*

**Response:** `{ "success": true, "data": { "id": "65f..." }, "message": "Product deleted successfully" }`

#### `GET /api/orders` *(auth: admin)*

Query params: `status` (`pending`/`processing`/`shipped`/`delivered`/`cancelled`), `page`, `limit`.

**Response:**
```json
{
  "success": true,
  "data": {
    "orders": [ ... ],
    "pagination": { "page": 1, "limit": 20, "total": 3, "totalPages": 1 }
  },
  "message": "Orders fetched successfully"
}
```

#### `PUT /api/orders/:id` *(auth: admin)*

**Request body:** `{ "status": "shipped" }` — allowed: `pending`, `processing`, `shipped`, `delivered`, `cancelled`.

**Response:** `{ "success": true, "data": { "order": {...} }, "message": "Order status updated successfully" }`

#### `GET /api/admin/stats` *(auth: admin)*

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProducts": 9,
    "totalOrders": 12,
    "totalRevenue": 2840,
    "totalCustomers": 54,
    "recentOrders": [ ...last 5 orders... ]
  },
  "message": "Dashboard stats fetched successfully"
}
```

---

## Deployment (Render / Railway)

1. Deploy the `backend` folder as a Node service.
2. Build / start command: `npm install && npm run seed` is optional; start command: `npm start`.
3. Set all environment variables in the dashboard (`PORT` is auto-set by the host — server already reads `process.env.PORT`).
4. Update `ALLOWED_ORIGINS` to your deployed frontend URLs.
