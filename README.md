# CodeMate Next Solved.ac Draft

독립형 Next.js App Router 초안입니다. 기존 Spring solved.ac 연동 로직을 참고해 다음 4가지 기능만 집중 구현했습니다.

- handle 조회
- bio 조회
- 문제 추천
- 특정 문제 풀이 검증

## Run

```bash
cmd /c npm install
cmd /c npm run dev
```

## Environment

`.env.example` 기준

- `SOLVED_AC_BASE_URL`
- `SOLVED_AC_TIMEOUT_MS`
- `SOLVED_AC_USER_AGENT`

## API

- `GET /api/solvedac/user?handle=...`
- `GET /api/solvedac/bio?handle=...`
- `POST /api/solvedac/recommend`
- `POST /api/solvedac/verify-problem`

에러 응답은 다음 형식입니다.

```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "solved.ac 호출 제한에 도달했습니다. 잠시 후 다시 시도해주세요.",
    "status": 429
  }
}
```
# test_sub
