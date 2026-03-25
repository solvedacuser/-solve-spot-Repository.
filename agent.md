# Agent Guide

## Project Intent
- This project is a standalone Next.js fullstack draft focused on solved.ac integration.
- Do not call the existing Spring backend from this app.
- Instead, port the solved.ac integration behavior from `be-main` into Next.js Route Handlers and server-only library code.
- The current v1 scope is:
  - handle lookup
  - bio lookup
  - unsolved problem recommendation
  - solved problem verification

## Runtime Stack
- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- Validation: Zod
- Tests: Vitest
- Persistence: none
- Cache: lightweight in-memory TTL cache for GET requests only

## Source Of Truth
The original reference lives in `be-main`, but another agent may not be able to open that folder. Use the behavior below as the actual source of truth.

### solved.ac client behavior to preserve
- Base URL is `https://solved.ac/api/v3`.
- User lookup uses `GET /user/show?handle={handle}`.
- Bio lookup uses the same endpoint `GET /user/show?handle={handle}` and reads only `handle` and `bio`.
- Problem search uses `GET /search/problem?query={query}&sort={sort}&direction={direction}`.
- The original backend sets a custom `User-Agent` header and uses short connect timeout plus longer response timeout.
- In this Next.js app, keep one server-only fetch client with:
  - custom `User-Agent`
  - timeout handling
  - centralized error mapping

### recommendation query logic from be-main
- Difficulty range defaults to `1..30`.
- Clamp both `minLevel` and `maxLevel` into `1..30`.
- If `minLevel > maxLevel`, swap them before building the query.
- Always include these base conditions:
  - `*{min}..{max}`
  - `s#1000..`
  - `lang:ko`
- If tag filters exist, add them as one grouped condition:
  - `(tag:implementation|tag:graph|tag:dp)`
- For each handle, exclude already-solved problems with:
  - `!s@{handle}`
- Join all conditions with `+`.
- Example:
  - `*7..15+s#1000..+lang:ko+(tag:implementation|tag:graph)+!s@tourist+!s@cubelover`

### solved verification logic from be-main
- To verify whether a user solved a specific problem, build this query:
  - `id:{problemId}+s@{handle}`
- Send it to `/search/problem` with:
  - `sort=id`
  - `direction=asc`
- If `items` exists and is not empty, treat it as solved.
- If `items` is empty, treat it as not solved.

### DTO shape from be-main
- `SolvedAcUserResponse` keeps only:
  - `handle`
  - `tier`
  - `solvedCount`
  - `maxStreak`
  - `rating`
- `SolvedAcUserBioResponse` keeps only:
  - `handle`
  - `bio`
- `ProblemSearchResponse` shape is:
  - `{ items: ProblemInfo[] }`
- `ProblemInfo` shape is:
  - `problemId`
  - `titleKo`
  - `level`
  - `acceptedUserCount`
  - `averageTries`
  - `tags`
  - local derived field `url`
- `url` is not read directly from solved.ac in the original backend.
- It is derived as:
  - `https://www.acmicpc.net/problem/{problemId}`

### error behavior from be-main
- solved.ac `404` for user lookup becomes user-not-found behavior.
- circuit-breaker-open or timeout/network problems become unavailable behavior.
- all other unexpected upstream failures become generic solved.ac API failure behavior.
- In this Next.js app, map those semantics into:
  - `404` -> `NOT_FOUND`
  - `429` -> `RATE_LIMITED`
  - timeout/network -> `UNAVAILABLE`
  - malformed upstream payload or other `5xx`-like failures -> `UPSTREAM_ERROR`

### original file references
- `D:\codemate\codemate_BE-main\codemate_BE-main\src\main\java\com\ryu\studyhelper\infrastructure\solvedac\SolvedAcClient.java`
- `D:\codemate\codemate_BE-main\codemate_BE-main\src\main\java\com\ryu\studyhelper\infrastructure\solvedac\client\SolvedAcRestClient.java`
- `D:\codemate\codemate_BE-main\codemate_BE-main\src\main\java\com\ryu\studyhelper\infrastructure\solvedac\dto\ProblemInfo.java`
- `D:\codemate\codemate_BE-main\codemate_BE-main\src\main\java\com\ryu\studyhelper\infrastructure\solvedac\dto\ProblemSearchResponse.java`
- `D:\codemate\codemate_BE-main\codemate_BE-main\src\main\java\com\ryu\studyhelper\infrastructure\solvedac\dto\SolvedAcUserResponse.java`
- `D:\codemate\codemate_BE-main\codemate_BE-main\src\main\java\com\ryu\studyhelper\infrastructure\solvedac\dto\SolvedAcUserBioResponse.java`
- `D:\codemate\codemate_BE-main\codemate_BE-main\src\main\java\com\ryu\studyhelper\common\util\ProblemUrlUtils.java`

## Current Next.js API Surface
These Route Handlers are the public API of this app:

- `GET /api/solvedac/user?handle=...`
  - returns:
    - `handle`
    - `tier`
    - `solvedCount`
    - `maxStreak`
    - `rating`
- `GET /api/solvedac/bio?handle=...`
  - returns:
    - `handle`
    - `bio`
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

## Current Next.js Implementation Map
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

## Upstream solved.ac Rules
- Base URL:
  - `https://solved.ac/api/v3`
- User endpoint:
  - `GET /user/show?handle={handle}`
- Problem search endpoint:
  - `GET /search/problem?query={query}&sort={sort}&direction={direction}`

### Important Query Rules
- Solved verification query:
  - `id:{problemId}+s@{handle}`
- Recommendation query:
  - `*{min}..{max}+s#1000..+lang:ko+...+!s@{handle}`
- Optional tag filter:
  - `(tag:implementation|tag:graph|tag:dp)`

### Important URL Joining Rule
- Do not use `new URL("/user/show", "https://solved.ac/api/v3")`.
- That drops `/api/v3` and incorrectly calls `https://solved.ac/user/show`.
- Always normalize as:
  - base URL with trailing slash
  - path without leading slash
- This bug already caused local `502` errors and has been fixed in `src/lib/solvedac/client.ts`.

## Error Contract
Normalize app errors into this shape:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "solved.ac에서 대상을 찾지 못했습니다.",
    "status": 404
  }
}
```

Allowed error codes:
- `NOT_FOUND`
- `BAD_REQUEST`
- `RATE_LIMITED`
- `UPSTREAM_ERROR`
- `UNAVAILABLE`

Error mapping rules:
- solved.ac `404` -> `NOT_FOUND`
- solved.ac `429` -> `RATE_LIMITED`
- other upstream `4xx` -> `BAD_REQUEST`
- upstream payload mismatch -> `UPSTREAM_ERROR`
- timeout / network failure -> `UNAVAILABLE`

## Validation Rules
- Validate request inputs with Zod before calling solved.ac.
- Validate upstream responses with Zod before returning them.
- Treat malformed upstream payloads as `502 UPSTREAM_ERROR`, not `400`.
- Treat malformed client request bodies as `400 BAD_REQUEST`.

## UI Rules
- Keep the app tool-like and input-first.
- Do not add auth, team state, DB persistence, or recommendation history unless explicitly requested.
- Keep all solved.ac calls behind Route Handlers.
- Client components should call only local `/api/solvedac/*` endpoints.

## Caching Rules
- Only cache GET-style lookups:
  - user info
  - bio
- Use short TTL in memory.
- Do not cache POST recommendation or solved verification by default.

## Commands
- Install:
  - `cmd /c npm install`
- Dev:
  - `cmd /c npm run dev`
- Test:
  - `cmd /c npm test`
- Lint:
  - `cmd /c npm run lint`
- Build:
  - `cmd /c npm run build`

## Verification Status
Current implementation has already been validated with:
- `cmd /c npm test`
  - passed: 6 files, 12 tests
- `cmd /c npm run lint`
  - passed

Known good behavior:
- `GET /api/solvedac/user?handle=solvedac` returns `200`
- invalid handle such as `wuwu4q77` returns `404 NOT_FOUND`

## Extension Guidance
If future work is needed:
- add new solved.ac features under `src/lib/solvedac/*` first
- expose them via `src/app/api/solvedac/*`
- keep UI separated from upstream client details
- keep Spring `be-main` query semantics aligned unless there is a deliberate product reason to diverge

---

# 한글 해석본

## 프로젝트 목적
- 이 프로젝트는 solved.ac 연동에 집중한 독립형 Next.js 풀스택 초안입니다.
- 이 앱에서 기존 Spring 백엔드를 직접 호출하지 않습니다.
- 대신 `be-main`의 solved.ac 연동 방식을 Next.js Route Handler와 server-only 라이브러리 코드로 옮겨 구현합니다.
- 현재 v1 범위는 다음 네 가지입니다.
  - handle 조회
  - bio 조회
  - 미해결 문제 추천
  - 특정 문제 풀이 검증

## 런타임 스택
- 프레임워크: Next.js App Router
- 언어: TypeScript
- 스타일링: Tailwind CSS
- 검증: Zod
- 테스트: Vitest
- 영속 저장소: 없음
- 캐시: GET 요청에만 사용하는 가벼운 메모리 TTL 캐시

## 기준 소스
solved.ac 동작을 구현할 때는 `be-main`의 아래 파일들을 기준으로 참고합니다.

- `D:\codemate\codemate_BE-main\codemate_BE-main\src\main\java\com\ryu\studyhelper\infrastructure\solvedac\SolvedAcClient.java`
- `D:\codemate\codemate_BE-main\codemate_BE-main\src\main\java\com\ryu\studyhelper\infrastructure\solvedac\client\SolvedAcRestClient.java`
- `D:\codemate\codemate_BE-main\codemate_BE-main\src\main\java\com\ryu\studyhelper\infrastructure\solvedac\dto\ProblemInfo.java`
- `D:\codemate\codemate_BE-main\codemate_BE-main\src\main\java\com\ryu\studyhelper\infrastructure\solvedac\dto\ProblemSearchResponse.java`
- `D:\codemate\codemate_BE-main\codemate_BE-main\src\main\java\com\ryu\studyhelper\infrastructure\solvedac\dto\SolvedAcUserResponse.java`
- `D:\codemate\codemate_BE-main\codemate_BE-main\src\main\java\com\ryu\studyhelper\infrastructure\solvedac\dto\SolvedAcUserBioResponse.java`
- `D:\codemate\codemate_BE-main\codemate_BE-main\src\main\java\com\ryu\studyhelper\common\util\ProblemUrlUtils.java`

## 현재 Next.js API 표면
현재 앱의 공개 API는 아래 Route Handler들입니다.

- `GET /api/solvedac/user?handle=...`
  - 반환값:
    - `handle`
    - `tier`
    - `solvedCount`
    - `maxStreak`
    - `rating`
- `GET /api/solvedac/bio?handle=...`
  - 반환값:
    - `handle`
    - `bio`
- `POST /api/solvedac/recommend`
  - 요청 본문:
    ```json
    {
      "handles": ["tourist", "cubelover"],
      "count": 5,
      "minLevel": 7,
      "maxLevel": 15,
      "tagKeys": ["implementation", "graph"]
    }
    ```
  - 반환값:
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
  - 요청 본문:
    ```json
    {
      "handle": "tourist",
      "problemId": 1000
    }
    ```
  - 반환값:
    ```json
    {
      "solved": true,
      "query": "id:1000+s@tourist"
    }
    ```

## 현재 Next.js 구현 위치
- Route Handler:
  - `src/app/api/solvedac/user/route.ts`
  - `src/app/api/solvedac/bio/route.ts`
  - `src/app/api/solvedac/recommend/route.ts`
  - `src/app/api/solvedac/verify-problem/route.ts`
- server-only solved.ac 코드:
  - `src/lib/solvedac/client.ts`
  - `src/lib/solvedac/service.ts`
  - `src/lib/solvedac/query.ts`
  - `src/lib/solvedac/schemas.ts`
  - `src/lib/solvedac/errors.ts`
  - `src/lib/solvedac/types.ts`
  - `src/lib/solvedac/cache.ts`
- UI 작업 화면:
  - `src/components/solvedac-workbench.tsx`

## solved.ac upstream 규칙
- 기본 URL:
  - `https://solved.ac/api/v3`
- 사용자 조회 엔드포인트:
  - `GET /user/show?handle={handle}`
- 문제 검색 엔드포인트:
  - `GET /search/problem?query={query}&sort={sort}&direction={direction}`

### 중요한 쿼리 규칙
- 풀이 검증 쿼리:
  - `id:{problemId}+s@{handle}`
- 추천 쿼리:
  - `*{min}..{max}+s#1000..+lang:ko+...+!s@{handle}`
- 선택 태그 필터:
  - `(tag:implementation|tag:graph|tag:dp)`

### 중요한 URL 결합 규칙
- `new URL("/user/show", "https://solved.ac/api/v3")`처럼 쓰면 안 됩니다.
- 이렇게 하면 `/api/v3`가 사라져서 잘못된 `https://solved.ac/user/show`를 호출하게 됩니다.
- 항상 아래 규칙으로 정규화해야 합니다.
  - base URL은 trailing slash 포함
  - path는 leading slash 제거
- 이 버그는 실제로 로컬 `502` 오류를 만들었고, 현재 `src/lib/solvedac/client.ts`에서 수정되어 있습니다.

## 에러 계약
앱 에러는 아래 형태로 정규화합니다.

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "solved.ac에서 대상을 찾지 못했습니다.",
    "status": 404
  }
}
```

허용되는 에러 코드는 아래와 같습니다.

- `NOT_FOUND`
- `BAD_REQUEST`
- `RATE_LIMITED`
- `UPSTREAM_ERROR`
- `UNAVAILABLE`

에러 매핑 규칙은 아래와 같습니다.

- solved.ac `404` -> `NOT_FOUND`
- solved.ac `429` -> `RATE_LIMITED`
- 그 외 upstream `4xx` -> `BAD_REQUEST`
- upstream 응답 형식 불일치 -> `UPSTREAM_ERROR`
- timeout 또는 네트워크 실패 -> `UNAVAILABLE`

## 검증 규칙
- solved.ac를 호출하기 전에 Zod로 요청 입력값을 검증합니다.
- 반환 전에 Zod로 upstream 응답을 검증합니다.
- upstream 응답 payload가 깨졌으면 `400`이 아니라 `502 UPSTREAM_ERROR`로 처리합니다.
- 클라이언트 요청 본문이 깨졌으면 `400 BAD_REQUEST`로 처리합니다.

## UI 규칙
- 앱은 도구형, 입력 우선 구조를 유지합니다.
- 명시적으로 요청되지 않는 한 auth, 팀 상태, DB 저장, 추천 이력은 추가하지 않습니다.
- solved.ac 호출은 모두 Route Handler 뒤에서만 처리합니다.
- 클라이언트 컴포넌트는 로컬 `/api/solvedac/*` 엔드포인트만 호출해야 합니다.

## 캐시 규칙
- GET 성격의 조회만 캐시합니다.
  - 사용자 정보
  - bio
- 짧은 TTL의 메모리 캐시를 사용합니다.
- 추천 POST나 풀이 검증 POST는 기본적으로 캐시하지 않습니다.

## 명령어
- 설치:
  - `cmd /c npm install`
- 개발 서버:
  - `cmd /c npm run dev`
- 테스트:
  - `cmd /c npm test`
- 린트:
  - `cmd /c npm run lint`
- 빌드:
  - `cmd /c npm run build`

## 검증 상태
현재 구현은 아래 명령으로 검증된 상태입니다.

- `cmd /c npm test`
  - 통과: 6 files, 12 tests
- `cmd /c npm run lint`
  - 통과

현재 확인된 정상 동작은 아래와 같습니다.

- `GET /api/solvedac/user?handle=solvedac` 는 `200` 반환
- `wuwu4q77` 같은 잘못된 handle은 `404 NOT_FOUND` 반환

## 확장 가이드
향후 기능을 추가할 때는 아래 순서를 우선합니다.

- 먼저 `src/lib/solvedac/*` 아래에 solved.ac 기능을 추가
- 그다음 `src/app/api/solvedac/*`로 노출
- UI는 upstream 클라이언트 세부사항과 분리 유지
- 제품 요구로 의도적으로 다르게 가는 경우가 아니면 Spring `be-main`의 쿼리 의미와 정렬

## Source of Truth 상세 해설
- 다른 에이전트가 `be-main` 폴더를 직접 열지 못해도 되도록, 여기의 설명을 구현 기준으로 사용합니다.

### solved.ac 클라이언트 핵심 규칙
- 기본 URL은 `https://solved.ac/api/v3` 입니다.
- 사용자 조회는 `GET /user/show?handle={handle}` 입니다.
- bio 조회도 같은 `GET /user/show?handle={handle}` 를 사용하고, 응답에서 `handle`, `bio`만 사용합니다.
- 문제 검색은 `GET /search/problem?query={query}&sort={sort}&direction={direction}` 입니다.
- 원본 백엔드는 `User-Agent`를 직접 넣고 timeout을 관리합니다.
- Next.js에서도 fetch 호출은 반드시 server-only 클라이언트 하나에 모아야 합니다.

### 추천 쿼리 생성 규칙
- 난이도 기본 범위는 `1..30` 입니다.
- `minLevel`, `maxLevel`은 모두 `1..30` 사이로 clamp 합니다.
- `minLevel > maxLevel`이면 둘을 swap 한 뒤 쿼리를 만듭니다.
- 항상 아래 조건을 포함합니다.
  - `*{min}..{max}`
  - `s#1000..`
  - `lang:ko`
- 태그가 있으면 아래처럼 하나의 그룹으로 묶습니다.
  - `(tag:implementation|tag:graph|tag:dp)`
- 각 handle마다 이미 푼 문제 제외 조건을 추가합니다.
  - `!s@{handle}`
- 모든 조건은 `+`로 이어 붙입니다.
- 예시:
  - `*7..15+s#1000..+lang:ko+(tag:implementation|tag:graph)+!s@tourist+!s@cubelover`

### 풀이 검증 규칙
- 특정 사용자가 특정 문제를 풀었는지 검증할 때는 아래 쿼리를 사용합니다.
  - `id:{problemId}+s@{handle}`
- `/search/problem`에 아래 정렬 조건으로 요청합니다.
  - `sort=id`
  - `direction=asc`
- 응답의 `items`가 비어 있지 않으면 solved 입니다.
- 응답의 `items`가 비어 있으면 not solved 입니다.

### DTO 의미
- 사용자 정보 응답에서 유지하는 필드는 아래뿐입니다.
  - `handle`
  - `tier`
  - `solvedCount`
  - `maxStreak`
  - `rating`
- bio 응답에서는 아래만 유지합니다.
  - `handle`
  - `bio`
- 문제 검색 응답 형태는 아래입니다.
  - `{ items: ProblemInfo[] }`
- `ProblemInfo`는 아래 필드를 사용합니다.
  - `problemId`
  - `titleKo`
  - `level`
  - `acceptedUserCount`
  - `averageTries`
  - `tags`
  - `url`
- `url`은 solved.ac에서 직접 받는 값이 아니라 로컬에서 아래 규칙으로 만듭니다.
  - `https://www.acmicpc.net/problem/{problemId}`

### 에러 의미
- solved.ac의 `404`는 대상 없음입니다.
- timeout, 네트워크 실패, circuit breaker 계열은 unavailable로 봅니다.
- 그 외 upstream 실패는 generic upstream error로 봅니다.
- 이 앱의 에러 코드 매핑은 아래를 유지합니다.
  - `404` -> `NOT_FOUND`
  - `429` -> `RATE_LIMITED`
  - timeout/network -> `UNAVAILABLE`
  - upstream payload 불일치 또는 기타 상위 서버 오류 -> `UPSTREAM_ERROR`

### 가장 중요한 URL 결합 주의점
- `new URL("/user/show", "https://solved.ac/api/v3")`처럼 쓰면 안 됩니다.
- 이렇게 하면 `/api/v3`가 사라져서 `https://solved.ac/user/show`를 호출하게 됩니다.
- 항상 아래 규칙을 지켜야 합니다.
  - base URL은 trailing slash 포함
  - path는 leading slash 제거
- 이 버그는 실제로 `502`를 만들었고 이미 현재 구현에서 수정된 상태입니다.
