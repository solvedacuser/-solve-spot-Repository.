# solved.ac Integration Reference

## Source Of Truth
- The original reference lives in `be-main`, but this document is the working source of truth for this repository.

## Reference Files
- `D:\codemate\codemate_BE-main\codemate_BE-main\src\main\java\com\ryu\studyhelper\infrastructure\solvedac\SolvedAcClient.java`
- `D:\codemate\codemate_BE-main\codemate_BE-main\src\main\java\com\ryu\studyhelper\infrastructure\solvedac\client\SolvedAcRestClient.java`
- `D:\codemate\codemate_BE-main\codemate_BE-main\src\main\java\com\ryu\studyhelper\infrastructure\solvedac\dto\ProblemInfo.java`
- `D:\codemate\codemate_BE-main\codemate_BE-main\src\main\java\com\ryu\studyhelper\infrastructure\solvedac\dto\ProblemSearchResponse.java`
- `D:\codemate\codemate_BE-main\codemate_BE-main\src\main\java\com\ryu\studyhelper\infrastructure\solvedac\dto\SolvedAcUserResponse.java`
- `D:\codemate\codemate_BE-main\codemate_BE-main\src\main\java\com\ryu\studyhelper\infrastructure\solvedac\dto\SolvedAcUserBioResponse.java`
- `D:\codemate\codemate_BE-main\codemate_BE-main\src\main\java\com\ryu\studyhelper\common\util\ProblemUrlUtils.java`

## solved.ac Client Behavior
- Base URL: `https://solved.ac/api/v3`
- User lookup: `GET /user/show?handle={handle}`
- Bio lookup uses the same endpoint and reads only `handle` and `bio`
- Problem search: `GET /search/problem?query={query}&sort={sort}&direction={direction}`
- Use one server-only fetch client with:
  - custom `User-Agent`
  - timeout handling
  - centralized error mapping

## Recommendation Query Rules
- Difficulty range defaults to `1..30`
- Clamp both `minLevel` and `maxLevel` into `1..30`
- If `minLevel > maxLevel`, swap them before building the query
- Always include these base conditions:
  - `*{min}..{max}`
  - `s#1000..`
  - `lang:ko`
- If tag filters exist, add one grouped condition:
  - `(tag:implementation|tag:graph|tag:dp)`
- For each handle, exclude already-solved problems:
  - `!s@{handle}`
- Join all conditions with `+`
- Example:
  - `*7..15+s#1000..+lang:ko+(tag:implementation|tag:graph)+!s@tourist+!s@cubelover`

## Solved Verification Rules
- Build the query as `id:{problemId}+s@{handle}`
- Send it to `/search/problem` with:
  - `sort=id`
  - `direction=asc`
- If `items` exists and is not empty, treat it as solved
- If `items` is empty, treat it as not solved

## DTO Shapes
- `SolvedAcUserResponse` keeps only:
  - `handle`
  - `tier`
  - `solvedCount`
  - `maxStreak`
  - `rating`
- `SolvedAcUserBioResponse` keeps only:
  - `handle`
  - `bio`
- `ProblemSearchResponse` shape:
  - `{ items: ProblemInfo[] }`
- `ProblemInfo` shape:
  - `problemId`
  - `titleKo`
  - `level`
  - `acceptedUserCount`
  - `averageTries`
  - `tags`
  - `url`
- Derive `url` locally as:
  - `https://www.acmicpc.net/problem/{problemId}`

## Current Next.js API Surface
- `GET /api/solvedac/user?handle=...`
  - returns `handle`, `tier`, `solvedCount`, `maxStreak`, `rating`
- `GET /api/solvedac/bio?handle=...`
  - returns `handle`, `bio`
- `POST /api/solvedac/recommend`
  - body:
    ```json
    {
      "handles": ["tourist", "cubelover"],
      "count": 5,
      "minLevel": 7,
      "maxLevel": 15,
      "tagKeys": ["implementation", "graph"]
    }
    ```
  - returns:
    ```json
    {
      "items": [
        {
          "problemId": 1000,
          "titleKo": "A+B",
          "level": 1,
          "acceptedUserCount": 123456,
          "averageTries": 1.2,
          "url": "https://www.acmicpc.net/problem/1000",
          "tags": []
        }
      ]
    }
    ```
- `POST /api/solvedac/verify-problem`
  - body:
    ```json
    {
      "handle": "tourist",
      "problemId": 1000
    }
    ```
  - returns:
    ```json
    {
      "solved": true,
      "query": "id:1000+s@tourist"
    }
    ```

## Current Implementation Map
- Route Handlers:
  - `src/app/api/solvedac/user/route.ts`
  - `src/app/api/solvedac/bio/route.ts`
  - `src/app/api/solvedac/recommend/route.ts`
  - `src/app/api/solvedac/verify-problem/route.ts`
- Server-only solved.ac code:
  - `src/lib/solvedac/client.ts`
  - `src/lib/solvedac/service.ts`
  - `src/lib/solvedac/query.ts`
  - `src/lib/solvedac/schemas.ts`
  - `src/lib/solvedac/errors.ts`
  - `src/lib/solvedac/types.ts`
  - `src/lib/solvedac/cache.ts`
- UI workbench:
  - `src/components/solvedac-workbench.tsx`

## Upstream Rules
- Base URL:
  - `https://solved.ac/api/v3`
- User endpoint:
  - `GET /user/show?handle={handle}`
- Problem search endpoint:
  - `GET /search/problem?query={query}&sort={sort}&direction={direction}`

## URL Joining Rule
- Do not use `new URL("/user/show", "https://solved.ac/api/v3")`
- That drops `/api/v3` and incorrectly calls `https://solved.ac/user/show`
- Always normalize with:
  - base URL including a trailing slash
  - path without a leading slash

## Error Contract
- Normalize app errors into:
  ```json
  {
    "error": {
      "code": "NOT_FOUND",
      "message": "User was not found on solved.ac.",
      "status": 404
    }
  }
  ```
- Allowed error codes:
  - `NOT_FOUND`
  - `BAD_REQUEST`
  - `RATE_LIMITED`
  - `UPSTREAM_ERROR`
  - `UNAVAILABLE`
- Mapping rules:
  - solved.ac `404` -> `NOT_FOUND`
  - solved.ac `429` -> `RATE_LIMITED`
  - other upstream `4xx` -> `BAD_REQUEST`
  - malformed upstream payload -> `UPSTREAM_ERROR`
  - timeout or network failure -> `UNAVAILABLE`

## Validation Rules
- Validate request inputs with Zod before calling solved.ac
- Validate upstream responses with Zod before returning them
- Treat malformed upstream payloads as `502 UPSTREAM_ERROR`, not `400`
- Treat malformed client request bodies as `400 BAD_REQUEST`

## UI Rules
- Keep the app tool-like and input-first
- Do not add auth, team state, database persistence, or recommendation history unless explicitly requested
- Keep all solved.ac calls behind Route Handlers
- Client components should call only local `/api/solvedac/*` endpoints

## Caching Rules
- Only cache GET-style lookups:
  - user info
  - bio
- Use a short in-memory TTL
- Do not cache recommendation or solved verification POST requests by default

## Commands
- Install: `cmd /c npm install`
- Dev: `cmd /c npm run dev`
- Test: `cmd /c npm test`
- Lint: `cmd /c npm run lint`
- Build: `cmd /c npm run build`

## Verified Behavior
- `cmd /c npm test`
  - passed: 6 files, 12 tests
- `cmd /c npm run lint`
  - passed
- Known good behavior:
  - `GET /api/solvedac/user?handle=solvedac` returns `200`
  - invalid handle such as `wuwu4q77` returns `404 NOT_FOUND`
