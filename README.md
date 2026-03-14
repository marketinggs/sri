# HackFlow - Full-Stack Dynamic Website

HackFlow is a hackathon-ready full-stack project built with **Next.js + Tailwind CSS**. It includes:

- Modern responsive UI (desktop + mobile)
- User auth (signup/login/logout) using signed JWT-style cookies
- Dynamic CRUD posts (create/edit/delete)
- API routes with auth protection
- Reusable components and global state using React Context
- Seed script with demo users and posts

## Tech Stack

- **Frontend**: Next.js App Router, React, Tailwind CSS
- **Backend**: Next.js Route Handlers (Node runtime)
- **Data Layer**: JSON datastore (`data/db.json`) with seed script
- **Auth**: Cookie-based signed tokens + secure password hashing (`crypto.scrypt`)

> If you want to upgrade to MongoDB later, you can replace `lib/db.js` with a Mongo client/model layer while preserving API and UI contracts.

## Setup

```bash
npm install
npm run seed
npm run dev
```

Open: `http://localhost:3000`

### Demo credentials after seeding

- `aarav@example.com` / `password123`
- `siya@example.com` / `password123`

## Environment Variables

Create `.env.local`:

```bash
JWT_SECRET=replace_with_long_random_secret
```

## Key Routes

- `/` - Landing page
- `/signup` - Register
- `/login` - Login
- `/dashboard` - Authenticated posting workspace

## API Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/posts`
- `POST /api/posts`
- `PUT /api/posts/:id`
- `DELETE /api/posts/:id`

## Folder Structure

```text
app/
  api/
    auth/
    posts/
  dashboard/
  login/
  signup/
components/
  layout/
  posts/
  providers/
lib/
  auth.js
  db.js
  http.js
data/
  db.json
scripts/
  seed.mjs
```

## Notes for Maintainability

- Clear modular files by concern (auth, data, transport, UI).
- Inline comments added for important utility flows.
- Reusable `PostForm`, `PostCard`, and `AuthProvider` components.
