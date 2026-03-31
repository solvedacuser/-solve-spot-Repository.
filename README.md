# CodeMate Next

CodeMate의 Next.js App Router 기반 초안 프로젝트입니다. 현재는 solved.ac 연동 기능을 중심으로 구현되어 있으며, 이후 Supabase 기반 인증과 데이터 기능을 확장할 예정입니다.

## 현재 범위
- solved.ac 유저 조회
- solved.ac bio 조회
- 미해결 문제 추천
- 특정 문제 풀이 여부 검증

## 환경 요구 사항
- Node.js 22.x
- npm 10+
- 인증 및 데이터 기능 확장을 위한 Supabase 프로젝트

## 환경 변수
`.env.example`을 `.env.local`로 복사한 뒤 실제 값을 채워서 사용합니다.

필수 항목:
- `SOLVED_AC_BASE_URL`
- `SOLVED_AC_TIMEOUT_MS`
- `SOLVED_AC_USER_AGENT`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

## 실행
```bash
cmd /c npm install
cmd /c npm run dev
```

## 점검 명령
```bash
cmd /c npm run lint
cmd /c npm test
```

## API
- `GET /api/solvedac/user?handle=...`
- `GET /api/solvedac/bio?handle=...`
- `POST /api/solvedac/recommend`
- `POST /api/solvedac/verify-problem`

## 참고 사항
- 이 앱에서 기존 Spring backend를 직접 호출하지 않습니다.
- solved.ac 호출은 모두 로컬 Route Handler 뒤에서 처리합니다.
- Supabase 관련 SQL 파일은 `database/` 아래에 둡니다.

## 프로젝트 구조
이 섹션은 현재 프로젝트의 실제 폴더 구조를 기준으로 정리한 것입니다. 구현 규칙과 우선순위는 `AGENTS.md`, `docs/ROADMAP.md`를 함께 참고합니다.

- `src/app`
  - Next.js App Router 페이지와 Route Handler를 둡니다.
  - solved.ac API 엔드포인트는 `src/app/api/solvedac/*` 아래에 있습니다.
- `src/components`
  - 재사용 UI 컴포넌트를 둡니다.
  - 현재 solved.ac UI 워크벤치는 `src/components/solvedac-workbench.tsx`에 있습니다.
- `src/lib`
  - 서버 중심 도메인 로직과 응답 헬퍼를 둡니다.
  - solved.ac 연동 로직은 `src/lib/solvedac/*` 아래에 있습니다.
- `src/utils`
  - 범용 유틸리티를 둡니다.
  - Supabase helper는 `src/utils/supabase/*` 아래에 있습니다.
- `database`
  - Supabase 관련 SQL 파일과 테이블 정의를 둡니다.
- `docs`
  - 요구사항, 로드맵, solved.ac 연동 규칙 문서를 둡니다.

### 트리 형태
```text
.
├── AGENTS.md                      # 에이전트 작업 규칙
├── README.md                      # 프로젝트 개요와 실행 방법
├── database/
│   └── profiles.sql               # Supabase profiles 테이블 SQL
├── docs/
│   ├── ROADMAP.md                 # 현재 진행 상태와 남은 단계
│   └── solvedac.md                # solved.ac 연동 규칙 문서
├── middleware.ts                  # Next 전역 미들웨어 진입점
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── solvedac/          # solved.ac Route Handlers
│   │   │       ├── bio/
│   │   │       ├── recommend/
│   │   │       ├── user/
│   │   │       └── verify-problem/
│   │   ├── globals.css            # 전역 스타일
│   │   ├── layout.tsx             # 루트 레이아웃
│   │   └── page.tsx               # 홈 페이지
│   ├── components/
│   │   └── solvedac-workbench.tsx # solved.ac UI 작업 화면
│   ├── lib/
│   │   ├── api-response.ts        # 공통 API 응답 헬퍼
│   │   └── solvedac/              # solved.ac 서버 로직
│   │       ├── cache.ts           # TTL 캐시
│   │       ├── client.test.ts     # 클라이언트 테스트
│   │       ├── client.ts          # solved.ac 호출 클라이언트
│   │       ├── errors.ts          # 에러 정의와 매핑
│   │       ├── query.test.ts      # 쿼리 빌더 테스트
│   │       ├── query.ts           # solved.ac 쿼리 생성
│   │       ├── schemas.ts         # Zod 스키마
│   │       ├── service.ts         # solved.ac 서비스 로직
│   │       └── types.ts           # 타입 정의
│   └── utils/
│       └── supabase/              # Supabase helper
│           ├── client.ts          # 브라우저용 클라이언트
│           ├── middleware.ts      # 세션 갱신 로직
│           └── server.ts          # 서버용 클라이언트
└── ...                            # 기타 설정 파일
```

## 구조 원칙
- solved.ac 연동은 먼저 `src/lib/solvedac`에 구현하고, 이후 `src/app/api/*`를 통해 노출합니다.
- 클라이언트에서 외부 API를 직접 호출하지 않고, 로컬 Route Handler 뒤에 둡니다.
- Supabase SQL 및 테이블 설정 파일은 `database/` 아래에 유지합니다.
- 상위 폴더는 먼저 의도적으로 설계하고, 세부 하위 폴더는 기능 구현에 맞춰 추가합니다.
