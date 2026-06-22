# Archive Outfitters

Full-stack auth (login + register) for the Archive Outfitters store.

## Projects
- `archive_FRONTEND` — Next.js 14 (App Router, TypeScript, Tailwind). Login / Register / Dashboard
  with Zod validation and a **Component → Action → API** flow. JWT stored in a cookie on login.
- `archive_BACKEND` — Express + MongoDB + TypeScript. User schema, registration (duplicate-email
  check + bcrypt password hashing), login (password verify + JWT), auth middleware, cookies.

## Running locally

### 1. Backend
```bash
cd archive_BACKEND
npm install
cp .env.example .env      # then edit values if needed
npm run dev               # http://localhost:5000
```

### 2. Frontend
```bash
cd archive_FRONTEND
npm install
npm run dev               # http://localhost:3000
```
The frontend proxies `/api/*` to the backend (see `next.config.js`), so no CORS setup is needed.

## API (base: `/api/v1`)
| Method | Endpoint          | Body                              | Notes                        |
|--------|-------------------|-----------------------------------|------------------------------|
| POST   | `/auth/register`  | fullName, email, password         | 409 if email already exists  |
| POST   | `/auth/login`     | email, password                   | returns token + sets cookie  |
| POST   | `/auth/logout`    | —                                 | clears cookie                |
| GET    | `/auth/whoami`    | — (cookie or Bearer token)        | current logged-in user       |

### Sample response
```json
{ "success": true, "message": "Logged in successfully",
  "data": { "token": "<jwt>", "user": { "id": "...", "fullName": "...", "email": "..." } } }
```
