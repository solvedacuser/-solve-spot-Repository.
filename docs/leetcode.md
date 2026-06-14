# LeetCode Integration Migration Reference

## Source Of Truth
- This document is the working source of truth for replacing the current solved.ac integration with LeetCode GraphQL.
- Active `/api/leetcode/*` Route Handlers currently expose only user, language, skill, and calendar lookups. Other LeetCode sections in this document are retained as future/reference material.
- The implementation should keep the same local-only architecture used by the solved.ac integration:
  - Do not call the existing Spring backend from this app.
  - Add LeetCode behavior under `src/lib/leetcode/*` first.
  - Expose the behavior later through `src/app/api/leetcode/*` Route Handlers.
  - Client components must call only local `/api/leetcode/*` endpoints.

## Project Goal
- Replace solved.ac upstream access with LeetCode GraphQL access.
- Preserve the current MVP intent where possible:
  - user lookup
  - bio lookup
  - problem recommendation
  - solved problem verification
- Document behavioral gaps clearly where LeetCode does not expose an equivalent public username API.
- Treat LeetCode GraphQL as an unofficial, unstable API surface. Queries can change without notice, so every upstream response must be validated before returning data to the app.

## Reference Materials
| Source | Role | Use In This Project |
| --- | --- | --- |
| [`leetcode-graphql-queries`](https://github.com/akarsh1995/leetcode-graphql-queries) | Primary GraphQL query source | Use this as the query reference for profile, problemset, problem detail, recent accepted submissions, and session-based question status. |
| [`alfa-leetcode-api`](https://github.com/alfaarghya/alfa-leetcode-api) | Secondary API inventory and query source | Use as a reference for endpoint candidates and compact GraphQL query documents. Do not call the hosted alfa API from this app. |
| [`leetcode-tui`](https://github.com/akarsh1995/leetcode-tui) | Secondary implementation reference | Use only as a supplemental reference for cookie-based LeetCode clients, GraphQL request abstraction, and run/submit flows. Do not depend on it for the public username MVP. |

## Reference File Roles
| Reference File | Relevant Queries | Notes |
| --- | --- | --- |
| [`profile_page.graphql`](https://github.com/akarsh1995/leetcode-graphql-queries/blob/main/profile_page/profile_page.graphql) | `userPublicProfile`, `userProblemsSolved`, `languageStats`, `skillStats`, `userContestRankingInfo`, `recentAcSubmissions` | Main source for public username profile data, bio, solved statistics, optional stats, and recent accepted submissions. |
| [`problemset_page.graphql`](https://github.com/akarsh1995/leetcode-graphql-queries/blob/main/problemset_page/problemset_page.graphql) | `problemsetQuestionList` | Main source for recommendation candidates using list filters such as difficulty, tags, `limit`, and `skip`. |
| [`problem_solve_page.graphql`](https://github.com/akarsh1995/leetcode-graphql-queries/blob/main/problem_solve_page/problem_solve_page.graphql) | `questionTitle`, `userQuestionStatus`, `submissionList`, `questionSubmissionList`, problem detail queries | Useful for problem metadata and session-based solved status. Session-dependent behavior is optional and out of MVP unless explicitly requested. |
| [`alfa-leetcode-api/src/GQLQueries`](https://github.com/alfaarghya/alfa-leetcode-api/tree/main/src/GQLQueries) | `languageStats`, `skillStats`, `userProfileCalendar`, `userContestRankingInfo`, `dailyProblem`, `selectProblem`, `officialSolution`, `problemList` | Useful for candidate endpoint discovery and smaller query examples. Keep local response contracts narrower than alfa's broad REST responses. |
| [`leetcode-tui`](https://github.com/akarsh1995/leetcode-tui) repository | cookie config, GraphQL client behavior, run/submit flows | Use only when designing future authenticated features. The current public username MVP should not import or wrap this Rust project. |

## solved.ac To LeetCode Capability Map
| Current solved.ac Feature | LeetCode Support | Primary GraphQL Query | Migration Notes |
| --- | --- | --- | --- |
| User lookup | Supported | `userPublicProfile`, `userProblemsSolved` | Return public profile fields and aggregate solved counts. Add `languageStats`, `skillStats`, or `userContestRankingInfo` only if the UI needs them. |
| Bio lookup | Supported | `userPublicProfile` | Map `matchedUser.profile.aboutMe` to the local `bio` response. Normalize missing or null bio to an empty string. |
| Problem recommendation | Partially supported | `problemsetQuestionList` | Can filter problem candidates by difficulty, tags, `limit`, and `skip`. Public username mode cannot exclude the complete solved history. |
| Solved verification | Limited for public usernames | `recentAcSubmissionList(username, limit)` | If `titleSlug` appears in recent accepted submissions, return solved. If it does not appear, return `UNKNOWN`, not unsolved. |
| Session-based solved status | Supported with cookies | `question(titleSlug) { status }` | Requires `LEETCODE_SESSION` and `csrftoken`. Keep optional/future because MVP should not store LeetCode sessions. |

## Public Username Limitations
- solved.ac supports query semantics such as `!s@handle`, which can exclude all solved problems for a handle.
- LeetCode public username GraphQL does not provide a reliable complete solved problem list for another user.
- For public usernames, the app can only exclude problems found in `recentAcSubmissionList(username, limit)`.
- A problem missing from recent accepted submissions must be treated as `UNKNOWN`, not as unsolved.
- Any UI or API text must avoid claiming exact "unsolved" recommendations unless session-based status is added.

## Recommended Semantics
### Public Recommendation Meaning
- The public recommendation API should mean:
  - "Return LeetCode problems matching the requested filters, excluding problems present in each user's recent accepted submissions."
- It should not mean:
  - "Return problems none of these users have ever solved."

### Recommended Response Metadata
- Include explicit exclusion metadata in recommendation responses:
  ```json
  {
    "exclusion": {
      "mode": "RECENT_ACCEPTED_SUBMISSIONS",
      "checkedLimit": 100,
      "usernames": ["alice", "bob"]
    }
  }
  ```
- Suggested `exclusion.mode` values:
  - `RECENT_ACCEPTED_SUBMISSIONS`: public username mode; limited by `checkedLimit`.
  - `SESSION_QUESTION_STATUS`: future authenticated mode; checks the current user's `question.status`.
  - `NONE`: recommendation did not apply solved exclusion.

## Active API Surface
| Endpoint | Method | Purpose | Cache |
| --- | --- | --- | --- |
| `/api/leetcode/user?username=...` | `GET` | Public user profile and solved stats | Yes, short TTL |
| `/api/leetcode/language?username=...` | `GET` | Public language solved counts | Yes, short TTL |
| `/api/leetcode/skill?username=...` | `GET` | Public tag solved counts grouped by skill level | Yes, short TTL |
| `/api/leetcode/calendar?username=...&year=2026` | `GET` | Public submission calendar summary | Yes, short TTL |

## Candidate API Extensions
These endpoints came from `alfa-leetcode-api` and `leetcode-graphql-queries`. P1 entries are implemented as profile extensions; lower-priority entries remain follow-up candidates.

| Priority | Endpoint | Method | Purpose | Suggested Upstream Query | Cache | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | `/api/leetcode/language?username=...` | `GET` | Public language solved counts | `languageStats` | Yes, short TTL | Small, profile-adjacent response from `matchedUser.languageProblemCount`. |
| P1 | `/api/leetcode/skill?username=...` | `GET` | Public tag solved counts grouped by skill level | `skillStats` | Yes, short TTL | Return `fundamental`, `intermediate`, and `advanced` groups with `tagName`, `tagSlug`, and `problemsSolved`. |
| P1 | `/api/leetcode/calendar?username=...&year=2026` | `GET` | Public submission calendar summary | `userProfileCalendar` | Yes, short TTL | Validate `year`; `submissionCalendar` is a JSON-encoded string upstream, so parse or return intentionally as a string. |
| P1 | `/api/leetcode/contest?username=...` | `GET` | Public contest ranking and contest history | `userContestRankingInfo` | Yes, short TTL | Useful profile extension. Treat missing contest ranking as an empty or null contest profile, not necessarily `NOT_FOUND`. |
| P2 | `/api/leetcode/badges?username=...` | `GET` | Public badges and upcoming badges | `userBadges` | Yes, short TTL | Useful for profile UI, but less important than stats. |
| P2 | `/api/leetcode/problems?limit=20&skip=0&difficulty=EASY&tags=array+hash-table` | `GET` | Public problem list without recommendation semantics | `problemsetQuestionList` | Yes, short TTL | Reuse the recommendation candidate mapping, but do not apply recent accepted exclusions. Exclude paid-only by default unless product decides otherwise. |
| P2 | `/api/leetcode/problem?titleSlug=two-sum` | `GET` | Public problem detail | `questionTitle`, `questionContent`, `singleQuestionTopicTags`, `questionStats`, or compact `selectProblem` | Yes, short TTL | Keep the response compact. Avoid returning broad raw page payloads unless the endpoint is explicitly marked raw/debug. |
| P2 | `/api/leetcode/daily` | `GET` | Daily coding challenge metadata | `questionOfToday` or compact `dailyProblem` | Yes, short TTL | Cache briefly and derive the problem URL locally from `link` or `titleSlug`. |
| P3 | `/api/leetcode/official-solution?titleSlug=two-sum` | `GET` | Official solution metadata/content when visible | `officialSolution` | Yes, short TTL | Must preserve `paidOnly` and `canSeeDetail`; never imply paid content is available when LeetCode withholds it. |
| P3 | `/api/leetcode/submissions?username=...&limit=20` | `GET` | Public recent submissions | `recentSubmissionList` | Yes, short TTL | Optional diagnostics/profile feature. Do not use it to claim complete solved history. |

### Candidate Extension Rules
- Keep all candidate endpoints under `src/app/api/leetcode/*` and all upstream access under `src/lib/leetcode/*`.
- Add Zod request validation and upstream response validation before exposing any candidate endpoint.
- Prefer compact, purpose-specific query documents over broad page dumps from reference repositories.
- Keep hosted `alfa-leetcode-api` as a reference only; this app should call LeetCode GraphQL directly from server-only code.
- Do not add discussion, check-in, mutation, run, submit, or session-only behavior unless authenticated LeetCode support is explicitly scoped.
- Do not use `userProgressQuestionList` or related session progress queries as a public complete solved-problem source.
- For any candidate that includes `question.status`, `isFavor`, `isLiked`, or other viewer-specific fields, document whether the field is anonymous, session-derived, or omitted.

## Identifier Rules
- Use `titleSlug` as the primary problem identifier.
- Do not use solved.ac-style numeric `problemId` in LeetCode request bodies.
- Return `questionFrontendId` for display when available.
- Derive problem URLs locally:
  - `https://leetcode.com/problems/${titleSlug}/`

## Request Drafts
### `GET /api/leetcode/user?username=...`
- Query params:
  - `username`: public LeetCode username
- Suggested upstream queries:
  - `userPublicProfile`
  - `userProblemsSolved`
  - optional: `languageStats`, `skillStats`, `userContestRankingInfo`

## GraphQL Query Notes
Keep query documents in server-only code, for example:
- `src/lib/leetcode/queries.ts`
- or one file per query under `src/lib/leetcode/queries/*`

Use compact, purpose-specific queries instead of copying entire page query dumps. The following are implementation sketches; keep the final query documents as small as the response DTOs allow.

```graphql
query UserPublicProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile { aboutMe ranking userAvatar realName reputation }
  }
}
```

```graphql
query UserProblemsSolved($username: String!) {
  allQuestionsCount { difficulty count }
  matchedUser(username: $username) {
    submitStatsGlobal { acSubmissionNum { difficulty count } }
  }
}
```

```graphql
query RecentAcceptedSubmissions($username: String!, $limit: Int!) {
  recentAcSubmissionList(username: $username, limit: $limit) {
    titleSlug
    timestamp
  }
}
```

```graphql
query ProblemsetQuestionList(
  $categorySlug: String
  $limit: Int
  $skip: Int
  $filters: QuestionListFilterInput
) {
  problemsetQuestionList: questionList(
    categorySlug: $categorySlug
    limit: $limit
    skip: $skip
    filters: $filters
  ) {
    total: totalNum
    questions: data {
      titleSlug
      title
      difficulty
      questionFrontendId
      paidOnly: isPaidOnly
    }
  }
}
```

```graphql
query UserQuestionStatus($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    status
  }
}
```

## Expected DTO Shapes
### User Response
```json
{
  "username": "alice",
  "profile": {
    "ranking": 12345,
    "avatarUrl": "https://assets.leetcode.com/users/alice/avatar.png",
    "realName": "Alice",
    "reputation": 42
  },
  "solved": {
    "total": 321,
    "easy": 120,
    "medium": 170,
    "hard": 31
  }
}
```

### Bio Response
```json
{
  "username": "alice",
  "bio": "Algorithms, TypeScript, and coffee."
}
```

### Recommendation Response
```json
{
  "items": [
    {
      "titleSlug": "two-sum",
      "questionFrontendId": "1",
      "title": "Two Sum",
      "difficulty": "EASY",
      "acRate": 55.1,
      "paidOnly": false,
      "url": "https://leetcode.com/problems/two-sum/",
      "tags": [
        {
          "name": "Array",
          "slug": "array"
        },
        {
          "name": "Hash Table",
          "slug": "hash-table"
        }
      ]
    }
  ],
  "exclusion": {
    "mode": "RECENT_ACCEPTED_SUBMISSIONS",
    "checkedLimit": 100,
    "usernames": ["alice"]
  }
}
```

### Recent Accepted Verification: Solved
```json
{
  "username": "alice",
  "titleSlug": "two-sum",
  "status": "SOLVED",
  "solved": true,
  "source": {
    "mode": "RECENT_ACCEPTED_SUBMISSIONS",
    "checkedLimit": 100
  }
}
```

### Recent Accepted Verification: Unknown
```json
{
  "username": "alice",
  "titleSlug": "two-sum",
  "status": "UNKNOWN",
  "solved": null,
  "source": {
    "mode": "RECENT_ACCEPTED_SUBMISSIONS",
    "checkedLimit": 100
  },
  "reason": "The problem was not found in the user's recent accepted submissions. This does not prove it is unsolved."
}
```

### Error Response
Use the same normalized error wrapper shape as the solved.ac integration:

```json
{
  "error": {
    "code": "UPSTREAM_ERROR",
    "message": "LeetCode returned an invalid GraphQL payload.",
    "status": 502
  }
}
```

## Suggested Type Names
- `LeetCodeUserResponse`
- `LeetCodeLanguageResponse`
- `LeetCodeSkillResponse`
- `LeetCodeCalendarResponse`
- `LeetCodeAppError`
- `LeetCodeGraphQLResponse<T>`

## Suggested Implementation Map
- Route Handlers:
  - `src/app/api/leetcode/user/route.ts`
  - `src/app/api/leetcode/language/route.ts`
  - `src/app/api/leetcode/skill/route.ts`
  - `src/app/api/leetcode/calendar/route.ts`
- Server-only LeetCode code:
  - `src/lib/leetcode/client.ts`
  - `src/lib/leetcode/service.ts`
  - `src/lib/leetcode/queries.ts`
  - `src/lib/leetcode/schemas.ts`
  - `src/lib/leetcode/errors.ts`
  - `src/lib/leetcode/types.ts`
  - `src/lib/leetcode/cache.ts`

## Client Rules
- Client components must never call `https://leetcode.com/graphql` directly.
- Client components must call only local `/api/leetcode/*` endpoints.
- Keep all LeetCode external calls in server-only code such as `src/lib/leetcode/client.ts`.
- Do not add persistence, session-cookie storage, run, or submit behavior as part of the public username MVP.

## Validation Rules
- Validate request inputs with Zod before calling LeetCode.
- Validate GraphQL `data` payloads with Zod before returning them.
- Treat GraphQL `errors` as `502 UPSTREAM_ERROR` unless there is a deliberate mapping for a known user-facing case.
- Treat malformed upstream payloads as `502 UPSTREAM_ERROR`, not `400 BAD_REQUEST`.
- Treat malformed client request bodies as `400 BAD_REQUEST`.
- Public username not found should map to `404 NOT_FOUND` when `matchedUser` is null or absent in an otherwise valid response.

## Error Contract
Normalize app errors into:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User was not found on LeetCode.",
    "status": 404
  }
}
```

Allowed error codes should stay aligned with the solved.ac implementation:
- `NOT_FOUND`
- `BAD_REQUEST`
- `RATE_LIMITED`
- `UPSTREAM_ERROR`
- `UNAVAILABLE`

Mapping rules:
- LeetCode HTTP `429` -> `RATE_LIMITED`
- LeetCode GraphQL `errors` -> `UPSTREAM_ERROR`
- malformed GraphQL payload -> `UPSTREAM_ERROR`
- timeout or network failure -> `UNAVAILABLE`
- invalid client input -> `BAD_REQUEST`
- `matchedUser: null` for user lookup -> `NOT_FOUND`

## Caching Rules
- Cache only public GET-style lookups:
  - user info
  - language stats
  - skill stats
  - calendar
- Use a short in-memory TTL, matching the current solved.ac cache approach.
- No active `/api/leetcode/*` POST endpoint is currently exposed.

## Environment Variables
Suggested `.env.example` additions:

```env
LEETCODE_GRAPHQL_URL=https://leetcode.com/graphql
LEETCODE_TIMEOUT_MS=5000
LEETCODE_USER_AGENT=codemate-next/0.1
```

Optional future authenticated variables:

```env
LEETCODE_SESSION=
LEETCODE_CSRFTOKEN=
```

Do not require authenticated variables for the public username MVP.

## Non-Goals
- Do not implement LeetCode username/password login.
- Do not store LeetCode session cookies in the MVP.
- Do not add LeetCode run or submit support as part of the solved.ac replacement scope.
- Do not claim support for fetching an exact complete solved problem list for a public username.
- Do not call the existing Spring backend.
- Do not add a persistence layer just for LeetCode migration.

## Migration Checklist
- [ ] Add `src/lib/leetcode/*` server-only modules.
- [ ] Add purpose-specific GraphQL query documents.
- [ ] Add Zod schemas for request input and upstream GraphQL output.
- [ ] Add user lookup service and route.
- [ ] Add language stats service and route.
- [ ] Add skill stats service and route.
- [ ] Add calendar service and route.
