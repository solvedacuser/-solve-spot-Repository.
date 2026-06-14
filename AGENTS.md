# AGENTS.md

## Project Intent
- This repository is a standalone Next.js fullstack draft focused on LeetCode integration.
- LeetCode integration replaces the previous solved.ac-first MVP direction.
- Do not call the existing Spring backend from this app.
- Do not call hosted wrapper APIs such as alfa-leetcode-api from this app.
- Call LeetCode GraphQL only from server-only integration code, then expose local Route Handlers.

## Current Scope
- Public LeetCode username lookup.
- Public language stats lookup.
- Public skill/tag stats lookup.
- Public submission calendar lookup.

## Runtime Stack
- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Zod.
- Vitest.
- Supabase Auth/Postgres utilities are present for app auth/profile work.
- Lightweight in-memory TTL cache for public GET-style LeetCode lookups.

## LeetCode Integration Rules
- Keep LeetCode upstream access behind `src/lib/leetcode/*`.
- Expose LeetCode behavior through `src/app/api/leetcode/*` Route Handlers.
- Client components must call only local `/api/leetcode/*` endpoints.
- Client components must never call `https://leetcode.com/graphql` directly.
- Add or change LeetCode behavior under `src/lib/leetcode/*` first, then expose it through Route Handlers.
- Keep GraphQL documents compact and purpose-specific; do not copy broad page dumps unless the local DTO requires it.
- Treat LeetCode GraphQL as unofficial and unstable. Validate every upstream response before returning data to the app.
- Do not implement LeetCode username/password login, run, submit, check-in, discussion, or session-only behavior unless explicitly scoped.
- Do not store LeetCode session cookies or CSRF tokens for the public username MVP.

## API Surface
- `GET /api/leetcode/user?username=...`
- `GET /api/leetcode/language?username=...`
- `GET /api/leetcode/skill?username=...`
- `GET /api/leetcode/calendar?username=...&year=...`

## Identifier Rules
- Use LeetCode `username` for public user requests.
- Use `titleSlug` as the primary problem identifier.
- Do not use solved.ac-style numeric `problemId` in LeetCode request bodies.
- Return `questionFrontendId` only as a display field when available.
- Derive problem URLs locally as `https://leetcode.com/problems/${titleSlug}/`.

## Recommendation And Verification Semantics
- No active `/api/leetcode/*` recommendation or solved-verification endpoint is currently exposed.
- Public username mode cannot fetch a reliable complete solved-problem list for another user.
- Recommendations may exclude only problems found in `recentAcSubmissionList(username, limit)`.
- Recommendation copy and API metadata must not claim exact "unsolved" results in public username mode.
- Include explicit exclusion metadata for recommendation responses:
  - `RECENT_ACCEPTED_SUBMISSIONS` when recent accepted submissions were checked.
  - `NONE` when no solved-exclusion check was applied.
  - `SESSION_QUESTION_STATUS` only for future authenticated mode.
- Public solved verification must return `SOLVED` when `titleSlug` appears in recent accepted submissions.
- Public solved verification must return `UNKNOWN`, not `UNSOLVED`, when `titleSlug` is absent from recent accepted submissions.
- Do not aggregate or display `UNKNOWN` as unsolved.

## Validation And Error Rules
- Validate request inputs with Zod before calling LeetCode.
- Validate GraphQL `data` payloads with Zod before returning responses.
- Treat malformed client request bodies as `400 BAD_REQUEST`.
- Treat GraphQL `errors` as `502 UPSTREAM_ERROR` unless a deliberate user-facing mapping exists.
- Treat malformed upstream payloads as `502 UPSTREAM_ERROR`.
- Map LeetCode HTTP `429` to `RATE_LIMITED`.
- Map timeout or network failure to `UNAVAILABLE`.
- Map `matchedUser: null` for user lookup-style endpoints to `404 NOT_FOUND`.
- Keep normalized error responses in this shape:
  - `{ "error": { "code": "...", "message": "...", "status": 000 } }`

## Caching And Persistence Rules
- Cache only public GET-style lookups by default:
  - user info
  - language stats
  - skill stats
  - calendar
- Use short in-memory TTL caching for LeetCode GET lookups.
- Do not add a persistence layer just for the LeetCode migration.
- If DB-backed history is explicitly scoped later, model LeetCode problems by `titleSlug` and verification status as `SOLVED` or `UNKNOWN`.

## Existing solved.ac Code
- `src/lib/solvedac/*`, `src/app/api/solvedac/*`, and `src/components/solvedac-workbench.tsx` may still exist as legacy or migration reference code.
- Do not extend solved.ac behavior unless the task explicitly asks for solved.ac work.
- Preserve solved.ac code while migrating unless removal is explicitly scoped.

## Important Files
- LeetCode reference: `docs/leetcode.md`
- Legacy solved.ac reference: `docs/solvedac.md`
- Roadmap/status notes: `docs/ROADMAP.md`
- LeetCode Route Handlers: `src/app/api/leetcode/*`
- LeetCode server-only integration: `src/lib/leetcode/*`
- Legacy solved.ac UI workbench: `src/components/solvedac-workbench.tsx`
- Shared API response helpers: `src/lib/api-response.ts`
- Auth forms/helpers: `src/lib/auth/*`, `src/components/auth/*`, `src/app/auth/*`
- Supabase utilities: `src/utils/supabase/*`
- Database drafts: `database/*`

## Environment Variables
- Public username MVP should work without LeetCode auth cookies.
- Suggested LeetCode variables:
  - `LEETCODE_GRAPHQL_URL=https://leetcode.com/graphql`
  - `LEETCODE_TIMEOUT_MS=5000`
  - `LEETCODE_USER_AGENT=codemate-next/0.1`
- Optional future authenticated variables:
  - `LEETCODE_SESSION`
  - `LEETCODE_CSRFTOKEN`

## Testing Rules
- Add or update Vitest coverage for changed service logic, schema validation, client normalization, and Route Handlers.
- Keep route tests close to their handlers, following the existing `route.test.ts` pattern.
- Run `npm test` when changes affect behavior.
- Run narrower Vitest targets when only one module or route changes.

## Detailed Reference
- See `docs/leetcode.md` for:
  - LeetCode GraphQL source references.
  - API surface.
  - DTO shapes.
  - public username limitations.
  - recommendation and verification semantics.
  - caching rules.
  - error mapping.
  - migration checklist.
- See `docs/ROADMAP.md` for implementation status and remaining product steps, but prefer `docs/leetcode.md` for LeetCode integration behavior.
