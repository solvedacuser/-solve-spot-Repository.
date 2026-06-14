# CodeMate Next

CodeMate의 Next.js App Router 기반 초안 프로젝트입니다. 현재는 leetcode 연동 기능을 중심으로 구현되어 있으며, 이후 Supabase 기반 인증과 데이터 기능을 확장할 예정입니다.


## 환경 요구 사항
- Node.js 22.x
- npm 10+
- 인증 및 데이터 기능 확장을 위한 Supabase 프로젝트
- CSS3
- Tailwind CSS 3.4.17

## 환경 변수
실제 값을 채워서 사용합니다.

필수 항목:
- `SOLVED_AC_BASE_URL`
- `SOLVED_AC_TIMEOUT_MS`
- `SOLVED_AC_USER_AGENT`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- 등등

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

## 실행 조건
데이터 베이스 로컬 설정, api 설정을 완료해야 실행 가능
