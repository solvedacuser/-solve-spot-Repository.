# AGENTS.md

## Project Intent
- This repository is a standalone Next.js fullstack draft focused on solved.ac integration.
- Do not call the existing Spring backend from this app.
- Port solved.ac behavior from `be-main` into Next.js Route Handlers and server-only library code.

## Current Scope
- Handle lookup
- Bio lookup
- Unsolved problem recommendation
- Solved problem verification

## Runtime Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Zod
- Vitest
- No persistence layer
- Lightweight in-memory TTL cache for GET requests only

## Working Rules
- Keep solved.ac access behind `src/app/api/solvedac/*`.
- Client components must call only local `/api/solvedac/*` endpoints.
- Add new solved.ac behavior under `src/lib/solvedac/*` first, then expose it through Route Handlers.
- Preserve the existing solved.ac query semantics unless there is a deliberate product reason to change them.
- Validate request inputs with Zod before calling solved.ac.
- Validate upstream responses with Zod before returning them.
- Treat malformed upstream payloads as `502 UPSTREAM_ERROR`.
- Cache only GET-style lookups such as user info and bio.
- Do not cache recommendation or solved-verification POST requests by default.

## Important Files
- Route Handlers: `src/app/api/solvedac/*`
- Server-only integration: `src/lib/solvedac/*`
- UI workbench: `src/components/solvedac-workbench.tsx`

## Detailed Reference
- See `docs/solvedac.md` for:
  - API surface
  - query rules
  - DTO shapes
  - upstream error mapping
  - URL joining caveat
  - commands and verified behavior
- See `docs/ROADMAP.md` for implementation status and remaining steps.
