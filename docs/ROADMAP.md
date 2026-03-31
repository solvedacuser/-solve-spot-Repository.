# CodeMate Next Roadmap

## Project Goal
- 기존 FE/BE 프로젝트의 방향을 참고해 CodeMate를 Next.js + Supabase 기반 웹사이트로 재구성한다.
- 기존 구조를 그대로 복제하지 않고, 현재 스택에 맞게 재설계한다.

## Target MVP
### 포함
- 이메일 + 비밀번호 회원가입/로그인
- 프로필
- BOJ handle 연결
- solved.ac 유저 조회
- solved.ac bio 조회
- 문제 추천
- 문제 풀이 검증
- 기본 대시보드

### 제외
- 팀 기능
- 알림
- 이메일 발송 자동화
- 운영 자동화
- 랭킹/고급 통계

## Architecture Direction
- Frontend: Next.js App Router
- Backend 역할: Next.js Route Handlers
- Auth/DB: Supabase Auth + Postgres + RLS
- 외부 연동: solved.ac
- 원칙: 기존 Spring backend를 직접 호출하지 않는다

## Status Overview
### Done
- solved.ac 연동 초안이 존재한다
- 루트 `AGENTS.md`를 정리했다
- `docs/solvedac.md`에 solved.ac 규칙을 문서화했다
- Supabase 패키지 설치를 완료했다
- Supabase env 항목을 정의했다
- Supabase browser/server client 구조를 추가했다
- Supabase middleware 세션 갱신 구조를 추가했다
- Supabase 연결을 확인했다
- `profiles` 테이블 생성 SQL 초안을 작성했다
- `README.md` 환경 요구사항을 정리했다

### In Progress
- 전체 제품 로드맵 정리
- Phase 3 데이터 모델 구체화

### Next
- Supabase Email Auth 설정
- 이메일 인증 및 비밀번호 재설정 URL 정리
- `saved_history` 테이블 설계
- `profiles`에 RLS 정책 추가
- auth route 구조 추가
- protected page 규칙 정리

### Later
- 팀 기능
- 알림
- 이메일 자동화
- 운영 기능

## Implementation Checklist
### Phase 1. Foundation
- [x] Node 버전 정책 고정
- [x] `package.json`에 `engines` 정의
- [x] `README.md` 환경 요구사항 정리
- [x] `.env.example`에 Supabase 항목 추가

### Phase 2. Supabase Setup
- [x] Supabase 프로젝트 생성
- [x] URL / anon key 확보
- [ ] Supabase Email Auth 설정
- [ ] 이메일 인증 및 비밀번호 재설정 URL 정리

### Phase 3. Data Model
- [x] `profiles` 테이블 초안 작성
- [x] `profiles` 테이블 생성 확인
- [ ] `saved_history` 테이블 설계
- [ ] RLS 정책 설계

### Phase 4. App Structure
- [x] Supabase browser/server client 구조 추가
- [x] middleware 세션 처리 추가
- [ ] auth route 구조 추가
- [ ] protected page 규칙 정리

### Phase 5. MVP Features
- [ ] 회원가입/로그인/로그아웃
- [ ] 프로필 및 BOJ handle 관리
- [ ] 추천 결과 저장
- [ ] 풀이 검증 결과 저장
- [ ] 대시보드 구성

### Phase 6. Post-MVP
- [ ] 팀 기능
- [ ] 알림
- [ ] 이메일
- [ ] 랭킹/통계

## Agent Working Rules
- 작업 전 `AGENTS.md`와 `docs/ROADMAP.md`를 먼저 읽는다
- 체크리스트 상태를 기준으로 다음 작업을 고른다
- 완료한 항목은 체크하고, 새 결정사항은 문서에 반영한다
- MVP 범위를 벗어나는 기능은 `Later`로 분리한다

## Current Next Action
- Supabase Email Auth 설정
- 이메일 인증 및 비밀번호 재설정 URL 정리
- `saved_history` 테이블 설계
- `profiles` RLS 정책 설계
