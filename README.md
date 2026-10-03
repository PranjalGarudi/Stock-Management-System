# Inventory Management System

Full-stack inventory management app.

## Tech Stack
- **Frontend:** Next.js, React, Tailwind CSS, Axios
- **Backend:** Node.js, Express.js, REST APIs
- **Database:** MongoDB, Mongoose
- **Auth:** JWT, bcrypt, role-based authorization (Admin, Manager, Staff)

## Structure
- `client/` — Next.js frontend (talks to the backend only via REST/Axios)
- `server/` — Express REST API backend

## Getting started

### Backend
```
cd server
npm install
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm run dev
```
Runs on http://localhost:5000

### Frontend
```
cd client
npm install
npm run dev
```
Runs on http://localhost:3000. Set `NEXT_PUBLIC_API_URL` if your API isn't on the default `http://localhost:5000/api`.

## Roles
- **Admin** — full access (create/update/delete products, manage inventory & orders)
- **Manager** — create/update products, manage inventory & orders
- **Staff** — view products, update stock, create orders

## Core modules
Authentication · Role-based authorization · Admin/Manager/Staff dashboards ·
Product management · Inventory management (stock tracking, low-stock detection) ·
Order management · Search · Filtering · Pagination · Reports (via dashboard stats)

## Notes
- Register the first user via `POST /api/auth/register` with `role: "admin"` to bootstrap access — there's no public signup page by design (admin creates other accounts, or open the endpoint temporarily for setup).
- No TypeScript, no EJS, no Next.js API routes — Next.js is a pure frontend that talks to Express over REST via `services/api.js`.
