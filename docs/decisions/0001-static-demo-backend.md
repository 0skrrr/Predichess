# 0001 — Run the public site on GitHub Pages with an in-browser backend

## Context
The project was only runnable locally: a Vite/React frontend plus an Express + Prisma/MariaDB backend. The goal is a public, zero-cost demo on GitHub Pages, which hosts static files only.

## Decision
Replace network calls with `demoFetch`, a route-compatible backend that runs in the browser and persists to `localStorage`. Build with `VITE_BASE_PATH=/<repo>/` and deploy via GitHub Actions.

## Alternatives considered
- **Host the Express server elsewhere (Render, Fly) and keep Pages for the frontend.** Real shared data, but needs a running server, a MySQL instance, CORS and secret management; free tiers sleep.
- **Move to a BaaS (Supabase/Firebase).** Shared data, but a rewrite of every route and new vendor lock-in.

## Consequences
- Accounts, lessons and progress are per-browser; there is no shared community feed beyond the seed lessons.
- `backend/` stays in the repo for local full-stack runs and as the reference for the API shape.
- Passwords use PBKDF2 rather than Argon2id/bcrypt (see `docs/features/demo-backend.md`).
