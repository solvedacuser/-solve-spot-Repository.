# Team Detail LeetCode Plan

## 기준
- 현재 프로젝트 기준으로 구현한다.
- 기존 Spring backend는 호출하지 않는다.
- LeetCode 외부 호출은 이미 구현된 `src/lib/leetcode/*`와 `src/app/api/leetcode/*`만 사용한다.
- 팀 상세 페이지 client component는 `https://leetcode.com/graphql`을 직접 호출하지 않고 local `/api/leetcode/*` endpoint만 호출한다.
- 불필요한 저장소, 팀 API, 스케줄러, 인증 시스템, DB schema를 새로 만들지 않는다.

## 현재 사용할 수 있는 코드
- 팀 상세 placeholder: `src/app/team/[id]/page.tsx`
- LeetCode 테스트 UI 참고: `src/components/leetcode-workbench.tsx`
- 추천 API: `src/app/api/leetcode/recommend/route.ts`
- 문제 인증 API: `src/app/api/leetcode/verify-problem/route.ts`
- LeetCode service: `src/lib/leetcode/service.ts`
- LeetCode request/upstream validation: `src/lib/leetcode/schemas.ts`
- LeetCode DTO: `src/lib/leetcode/types.ts`
- 상세 reference: `docs/leetcode.md`

## 문제 정의
팀 상세 페이지에서 최소 기능으로 다음을 제공한다.

1. 사용자가 팀원 LeetCode username 목록을 입력한다.
2. 난이도, 태그, 문제 수를 선택한다.
3. `/api/leetcode/recommend`로 문제 후보를 받아 화면에 표시한다.
4. 각 문제 카드에서 LeetCode 문제 링크를 연다.
5. 사용자가 자신의 LeetCode username과 문제 `titleSlug`로 `/api/leetcode/verify-problem` 인증을 실행한다.
6. 인증 결과가 `SOLVED`이면 해당 문제를 화면에서 해결 완료로 표시한다.
7. 인증 결과가 `UNKNOWN`이면 실패로 단정하지 않고 "최근 accepted 제출에서 확인되지 않음"으로 표시한다.

## LeetCode API 의미 제한
solved.ac는 `!s@handle`, `id:{problemId}+s@{handle}`로 전체 solved history 기반 제외와 인증이 가능했다.

LeetCode public username API는 전체 solved problem list를 안정적으로 제공하지 않는다. 현재 구현은 `recentAcSubmissionList(username, limit)` 기반이다.

따라서 현재 기능의 의미는 다음으로 제한한다.

- 추천: 팀원들의 최근 accepted submissions에 있는 문제를 제외한 LeetCode 문제 후보.
- 인증 성공: 최근 accepted submissions 안에서 `titleSlug`가 발견됨.
- 인증 `UNKNOWN`: 최근 accepted submissions 안에서 발견되지 않음. 미해결 증명이 아니다.

## API 계약
### 추천 요청
```json
{
  "usernames": ["alice", "bob"],
  "count": 3,
  "difficulty": ["EASY", "MEDIUM"],
  "tagSlugs": ["array", "dynamic-programming"],
  "skip": 137,
  "recentAcceptedLimit": 100
}
```

`skip`은 추천 다양성을 위한 LeetCode problemset offset이다. 같은 필터로 매번 같은 앞쪽 문제만 추천되는 것을 줄이기 위해 client에서 추천 요청마다 `0..200` 범위의 랜덤 정수를 생성해 전달한다.

- 장점: DB나 추천 이력 저장 없이 매 요청의 후보 구간이 달라진다.
- 한계: 이전 추천 문제를 영구적으로 기억해 제외하지는 않는다. 새로고침하거나 같은 랜덤 offset이 다시 나오면 같은 문제가 다시 추천될 수 있다.
- 현재 범위에서는 추천 결과 저장과 team backend를 만들지 않으므로, “이전 추천 제외”가 아니라 “추천마다 후보 구간 변경”으로 정의한다.

### 추천 응답 사용 필드
```ts
type LeetCodeRecommendationResponse = {
  items: Array<{
    titleSlug: string;
    questionFrontendId: string;
    title: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    acRate: number;
    paidOnly: boolean;
    url: string;
    tags: Array<{ name: string; slug: string }>;
  }>;
  exclusion: {
    mode: "RECENT_ACCEPTED_SUBMISSIONS" | "NONE";
    checkedLimit: number;
    usernames: string[];
  };
};
```

### 인증 요청
```json
{
  "username": "alice",
  "titleSlug": "two-sum",
  "recentAcceptedLimit": 100
}
```

### 인증 응답 사용 필드
```ts
type LeetCodeVerifyProblemResponse = {
  username: string;
  titleSlug: string;
  status: "SOLVED" | "UNKNOWN";
  solved: boolean | null;
  reason?: string;
};
```

## 구현 범위
### 포함
- `src/app/team/[id]/page.tsx`를 실제 팀 상세 페이지 초안으로 교체한다.
- 필요하면 `src/components/team-leetcode-panel.tsx` 같은 client component 하나만 추가한다.
- 추천/인증 form과 결과 card UI를 만든다.
- 화면 상태는 component state로만 관리한다.
- 인증 성공 상태도 현재 화면에서만 표시한다.

### 제외
- Supabase schema 추가
- 추천 결과 저장
- 오늘 미션 중복 생성 방지
- 팀원/스쿼드 권한 검증
- 스케줄러
- 이메일 발송
- LeetCode session cookie 기반 정확 인증
- solved.ac 호환 계층
- 새 `/api/teams/*` Route Handler

## UI 동작
- 입력:
  - 팀원 usernames: comma 또는 newline 분리
  - 인증 username: 단일 username
  - difficulty: `EASY`, `MEDIUM`, `HARD` checkbox
  - tagSlugs: comma 또는 whitespace 분리
  - count: 1~50
  - recentAcceptedLimit: 1~100
- 추천 결과:
  - 문제 번호는 `questionFrontendId`로 표시한다.
  - 문제 식별자는 `titleSlug`를 사용한다.
  - 난이도는 LeetCode difficulty badge로 표시한다.
  - 링크는 API 응답의 `url`을 사용한다.
  - `exclusion.mode`와 `checkedLimit`을 작게 표시해 추천 한계를 알려준다.
  - 추천 요청에 사용된 랜덤 `skip` 값을 작게 표시해 이번 추천 후보 구간을 확인할 수 있게 한다.
- 인증 결과:
  - `SOLVED`: 해당 card를 solved 상태로 변경한다.
  - `UNKNOWN`: warning 상태로 표시하고 `reason`을 노출한다.
  - API error: 기존 normalized error의 `code`와 `message`를 표시한다.

## 구현 순서
1. `src/components/leetcode-workbench.tsx`에서 추천/인증 호출부만 참고한다.
2. 팀 상세용 client component를 만든다.
3. `src/app/team/[id]/page.tsx`에서 `params.id`와 client component를 렌더링한다.
4. 새 API나 service를 만들지 않고 기존 `/api/leetcode/recommend`, `/api/leetcode/verify-problem`만 호출한다.
5. 기존 LeetCode route/service 코드는 변경하지 않는다. 버그가 확인된 경우에만 최소 수정한다.
6. `npm test`로 기존 LeetCode 테스트가 깨지지 않는지 확인한다.

## 완료 기준
- 팀 상세 페이지에서 LeetCode 추천을 실행할 수 있다.
- 추천 결과 문제 card가 표시된다.
- 각 문제를 LeetCode 링크로 열 수 있다.
- 문제별 인증을 실행할 수 있다.
- `SOLVED`와 `UNKNOWN`을 구분해서 표시한다.
- client component가 LeetCode 외부 API를 직접 호출하지 않는다.
- 새 persistence나 team backend 코드를 만들지 않는다.
