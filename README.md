<<<<<<< HEAD
# Earnest-Data-TMS
Task Management System for Earnest Data Analytics Assessment (Node.js + TypeScript + SQL)
=======
# Task Management System (Track A)

A full-stack task management application with:

- **Backend**: Node.js + TypeScript + Express + Prisma + SQLite
- **Auth**: JWT access token + refresh token stored in an HttpOnly cookie
- **Frontend**: Next.js App Router + TypeScript
- **Features**: Register, login, logout, refresh session, CRUD tasks, pagination, filtering, search, toggle status

## Project structure

```text
task-management-system/
├── backend/
└── frontend/
```

## Quick start

### 1) Backend
```bash
cd backend
copy .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev
```

### 2) Frontend
```bash
cd frontend
copy .env.example .env.local
npm install
npm run dev
```

## Environment variables

### backend/.env
- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CLIENT_ORIGIN`
- `PORT`

### frontend/.env.local
- `NEXT_PUBLIC_API_URL`

## Default flow

- Register or login on the frontend
- Access token is stored in `localStorage`
- Refresh token is kept in an HttpOnly cookie
- When an API call returns 401, the frontend attempts `/auth/refresh` and retries the request

## Notes

- SQLite is used for easy local setup. You can switch to PostgreSQL by changing `DATABASE_URL` in `backend/.env`.
- This is a production-friendly starter that you can extend with tests, deployment config, and UI polish.
>>>>>>> f34e95df (initial commit)
