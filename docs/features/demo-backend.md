# In-browser demo backend

GitHub Pages serves static files only, so the Express + MySQL server in `backend/` cannot run there. The frontend instead talks to `src/shared/demoBackend/`, which answers the same routes with the same JSON shapes and keeps its data in `localStorage` (key `predichess.demoDatabase.v1`).

## How requests flow

`support_scripts/url.ts` exports `apiFetch`, currently bound to `demoFetch`. Call sites pass a path such as `/lessons/12/data` plus the usual `RequestInit`. `demoFetch` matches the method and path against a route table and returns a real `Response`, so existing `response.ok`, `status === 204` and `response.json()` handling works unchanged.

To point the app back at a real server later, bind `apiFetch` to a function that prefixes the server URL and calls `fetch`.

## Data

- First load seeds three published lessons by a built-in "Predichess" account that cannot log in (its password hash is not a valid PBKDF2 output).
- Every visitor has their own database. Nothing is shared between browsers, and clearing site data resets it.
- If `localStorage` is unavailable (private mode, blocked storage) the app still works for the session from an in-memory copy.

## Security notes

- Passwords are hashed with PBKDF2-SHA256, 210 000 iterations and a 16-byte random salt via Web Crypto. Argon2id/bcrypt are not available in the browser without a WASM dependency; since the data never leaves the visitor's own browser this was judged sufficient. See `docs/decisions/0001-static-demo-backend.md`.
- Ownership checks (only the creator may save or publish a lesson) are enforced inside `demoBackend`, mirroring the server. They protect against UI bugs, not a malicious visitor, who controls their own `localStorage` anyway.
- Request bodies are parsed defensively; malformed JSON returns 400 and unknown routes 404.

## Showcase notice

On first visit `shared/showcaseNotice/ShowcaseNotice.tsx` explains that this is a browser-only showcase and that data stays local. Dismissal is remembered under the `localStorage` key `predichess.showcaseNoticeDismissed`; if storage is blocked the notice simply shows again on the next visit.
