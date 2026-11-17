# Predichess

Build and play interactive chess lessons. Authors put lessons together from board positions, text and questions; players work through them and earn XP and Elo.

**Live demo:** https://0skrrr.github.io/Predichess/

> The live demo is a showcase build. It runs entirely in your browser: accounts, lessons and progress are saved in that browser's local storage and never sent anywhere. Don't use a real password.

## Features

- **Learn** — browse community lessons, step through boards, explanations and questions, and finish with a score, XP and an Elo change.
- **Editor** — create lessons from tasks and steps (board, text, question), save drafts and publish with a difficulty rating.
- **Home** — your profile, Elo, XP, the last lesson you worked on and the last one you completed.

## Run it locally

```bash
cd frontend
npm ci
npm run dev
```

Other scripts in `frontend/`:

| Command | What it does |
| --- | --- |
| `npm test` | Runs the Vitest suite |
| `npm run build` | Type-checks and builds to `frontend/dist` |
| `npm run lint` | Runs ESLint |

`VITE_BASE_PATH` sets the public path the build is served from (see `frontend/.env.example`). It defaults to `/`; the deploy workflow sets it to `/<repo-name>/`.

## How it's built

- **Frontend:** React 19, TypeScript and Vite in `frontend/`.
- **Demo backend:** `frontend/src/shared/demoBackend/` answers the same API routes as the original server and stores data in `localStorage`. See [docs/features/demo-backend.md](docs/features/demo-backend.md).
- **Original backend:** `backend/` holds the Express + Prisma/MariaDB server the project first ran on. It is not used by the live demo and is kept as the reference for the API.
- **Deploy:** `.github/workflows/deploy-pages.yml` tests, builds and publishes to GitHub Pages on every push to `main`.

Why the demo runs without a server: [docs/decisions/0001-static-demo-backend.md](docs/decisions/0001-static-demo-backend.md).

## Contributing

Read [AGENTS.md](AGENTS.md) first. It applies to people and AI agents alike.
