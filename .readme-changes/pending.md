---
agent: Claude Code
model: claude-opus-5-5
---
The app is now deployed to GitHub Pages by `.github/workflows/deploy-pages.yml` on every push to `main`. It runs fully in the browser: `frontend/src/shared/demoBackend` stands in for the Express API and stores data in `localStorage`. Run locally with `cd frontend && npm ci && npm run dev`; tests with `npm test`. `VITE_BASE_PATH` (see `frontend/.env.example`) sets the public path.
