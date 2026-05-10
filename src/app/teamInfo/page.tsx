const squads = ["스쿼드 A", "스쿼드 B", "스쿼드 C"];

const teamStats = [
  { label: "문제 난이도", value: "Silver ~ Gold" },
  { label: "문제 수", value: "3문제 / 일" },
  { label: "문제 태그", value: "BFS, DFS, Queue, Stack, Search Tree" },
  { label: "스터디 요일", value: "월, 수, 금" },
];

const problemColumns = [
  {
    title: "미해결",
    tone: "border-amber-100 bg-amber-50 text-amber-950",
    count: 3,
    problems: [
      { id: 1260, title: "DFS와 BFS", tags: ["그래프", "DFS", "BFS"] },
      { id: 2178, title: "미로 탐색", tags: ["BFS", "그래프"] },
      { id: 2667, title: "단지번호붙이기", tags: ["DFS", "BFS"] },
    ],
  },
  {
    title: "도전 중",
    tone: "border-sky-100 bg-sky-50 text-sky-950",
    count: 2,
    problems: [
      { id: 7576, title: "토마토", tags: ["BFS", "Queue"] },
      { id: 11724, title: "연결 요소의 개수", tags: ["DFS", "Graph"] },
    ],
  },
  {
    title: "해결 완료",
    tone: "border-emerald-100 bg-emerald-50 text-emerald-950",
    count: 1,
    problems: [
      { id: 1000, title: "A+B", tags: ["구현", "입출력"] },
    ],
  },
];

const members = [
  {
    name: "gylim7826",
    email: "giyoung****@gmail.com",
    role: "팀장",
    squad: "스쿼드 C",
    initial: "G",
    color: "bg-blue-600",
    score: 92,
  },
  {
    name: "junehae",
    email: "jgu0****@gmail.com",
    role: "팀원",
    squad: "스쿼드 C",
    initial: "J",
    color: "bg-slate-400",
    score: 81,
  },
  {
    name: "minseo",
    email: "min****@gmail.com",
    role: "팀원",
    squad: "스쿼드 A",
    initial: "M",
    color: "bg-teal-600",
    score: 74,
  },
];

const activityDays = [
  { day: "4", weekday: "월" },
  { day: "5", weekday: "화" },
  { day: "6", weekday: "수" },
  { day: "7", weekday: "목" },
  { day: "8", weekday: "금" },
  { day: "9", weekday: "토" },
  { day: "10", weekday: "오늘" },
];

const activities = [
  { squad: "스쿼드 C", name: "gylim7826", total: 9, values: [0, 2, 0, 1, 2, 2, 2] },
  { squad: "스쿼드 C", name: "junehae", total: 5, values: [1, 0, 2, 1, 0, 1, 0] },
  { squad: "스쿼드 A", name: "minseo", total: 7, values: [2, 1, 1, 0, 1, 2, 0] },
  { squad: "스쿼드 B", name: "doyoon", total: 3, values: [0, 0, 1, 0, 1, 0, 1] },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function SectionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cx(
        "rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur",
        className,
      )}
    >
      {children}
    </section>
  );
}

function Badge({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "slate" | "blue" | "green" | "purple";
}) {
  const tones = {
    slate: "bg-slate-100 text-slate-600",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <span className={cx("rounded-md px-2.5 py-1 text-xs font-semibold", tones[tone])}>
      {children}
    </span>
  );
}

function TeamHeader() {
  return (
    <section className="border-b border-slate-200/80 pb-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">자바 2반</h1>
            <Badge tone="green">모집 중</Badge>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">자바를 자바보는 모임입니다.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            가입 신청
          </button>
          <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">
            준비 중
          </span>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-medium text-slate-400">스쿼드</span>
        {squads.map((squad, index) => (
          <button
            key={squad}
            type="button"
            className={cx(
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              index === 0
                ? "border-slate-900 bg-slate-950 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
            )}
          >
            {squad}
          </button>
        ))}
        <Badge tone="purple">NEW</Badge>
      </div>
    </section>
  );
}

function MissionCard() {
  return (
    <SectionCard className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-blue-100 bg-blue-50/80 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-sm font-bold text-blue-700">
            D
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-950">오늘의 미션</h2>
            <p className="text-xs text-slate-500">오전 6시 초기화</p>
          </div>
        </div>
        <Badge tone="blue">스쿼드 A</Badge>
      </div>

      <div className="flex min-h-48 flex-col items-center justify-center px-6 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-2xl font-bold text-blue-500">
          3
        </div>
        <h3 className="mt-5 text-base font-bold text-slate-950">문제 추천이 설정되었습니다</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          오늘 풀 문제를 상태별로 확인하고 팀원 진행 상황을 비교하세요.
        </p>
      </div>
    </SectionCard>
  );
}

function TeamGoalCard() {
  return (
    <SectionCard className="p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Study Direction</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
            SolveSpot의 스터디 방향은?
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[520px]">
          {teamStats.map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
              <p className="text-xs font-medium text-slate-400">{item.label}</p>
              <p className="mt-1 truncate text-sm font-semibold text-slate-800">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function ProblemBoard() {
  return (
    <SectionCard className="p-5">
      <div className="mb-5 flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-950">오늘의 문제</h2>
          <p className="mt-1 text-sm text-slate-500">스쿼드별 추천 문제의 현재 진행 상태입니다.</p>
        </div>
        <Badge tone="blue">총 6문제</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {problemColumns.map((column) => (
          <div key={column.title} className="min-w-0">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">{column.title}</h3>
              <span className="text-xs font-semibold text-slate-400">{column.count}</span>
            </div>
            <div className="space-y-3">
              {column.problems.map((problem) => (
                <article
                  key={problem.id}
                  className={cx("rounded-2xl border px-4 py-3 shadow-sm", column.tone)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-semibold">#{problem.id}</p>
                      <h4 className="mt-1 truncate text-sm font-bold">{problem.title}</h4>
                    </div>
                    <span className="rounded-md bg-white/70 px-2 py-1 text-[11px] font-bold">BOJ</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {problem.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-white/70 px-2 py-1 text-[11px] font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function ActivityIntensity({ value }: { value: number }) {
  const styles = [
    "bg-slate-100 text-slate-400",
    "bg-emerald-50 text-emerald-700",
    "bg-emerald-200 text-emerald-950",
    "bg-emerald-300 text-emerald-950",
  ];

  return (
    <div
      className={cx(
        "flex h-9 min-w-20 items-center justify-center rounded-lg text-xs font-bold",
        styles[Math.min(value, styles.length - 1)],
      )}
    >
      {value || "-"}
    </div>
  );
}

function TeamActivity() {
  return (
    <SectionCard className="overflow-hidden">
      <div className="border-b border-slate-200 px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">팀 활동</h2>
            <p className="mt-1 text-sm text-slate-500">Last 7 days</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400">보기</span>
            <Badge tone="blue">스쿼드별</Badge>
            <Badge>팀 통합</Badge>
            <span className="ml-2 text-slate-400">정렬</span>
            <Badge tone="blue">기본</Badge>
            <Badge>해결 수</Badge>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto px-5 py-5">
        <table className="min-w-[780px] w-full border-separate border-spacing-y-2 text-left text-sm">
          <thead>
            <tr className="text-xs font-semibold text-slate-400">
              <th className="w-28 px-1 py-2">스쿼드</th>
              <th className="w-36 px-1 py-2">팀원명</th>
              <th className="w-24 px-1 py-2 text-center">해결 수</th>
              {activityDays.map((day) => (
                <th key={`${day.day}-${day.weekday}`} className="px-1 py-2 text-center">
                  <span className={day.weekday === "오늘" ? "text-rose-500" : undefined}>{day.day}</span>
                  <span className="mt-0.5 block">{day.weekday}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.name}>
                <td className="px-1 py-1 text-xs font-semibold text-slate-400">{activity.squad}</td>
                <td className="px-1 py-1 font-semibold text-slate-800">{activity.name}</td>
                <td className="px-1 py-1 text-center font-bold text-slate-700">{activity.total}</td>
                {activity.values.map((value, index) => (
                  <td key={`${activity.name}-${index}`} className="px-1 py-1">
                    <ActivityIntensity value={value} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex flex-wrap items-center justify-end gap-2 text-xs text-slate-400">
          <span>Less</span>
          {[0, 1, 2, 3].map((value) => (
            <span
              key={value}
              className={cx(
                "h-3 w-3 rounded-sm",
                value === 0 && "bg-slate-100",
                value === 1 && "bg-emerald-50",
                value === 2 && "bg-emerald-200",
                value === 3 && "bg-emerald-300",
              )}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </SectionCard>
  );
}

function RecommendationInfo() {
  return (
    <SectionCard className="p-5">
      <h2 className="text-base font-bold text-slate-950">문제 추천 정보</h2>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-500">문제 추천</span>
          <span className="font-semibold text-blue-700">활성</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-500">추천 시간</span>
          <span className="font-semibold text-slate-700">매일 06:00</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-500">중복 제외</span>
          <span className="font-semibold text-slate-700">팀 전체</span>
        </div>
      </div>
    </SectionCard>
  );
}

function MembersCard() {
  return (
    <SectionCard className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-950">멤버 ({members.length})</h2>
        <Badge>스쿼드 C</Badge>
      </div>
      <div className="space-y-4">
        {members.map((member) => (
          <div key={member.name} className="flex items-center gap-3">
            <div
              className={cx(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white",
                member.color,
              )}
            >
              {member.initial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-sm font-bold text-slate-950">@{member.name}</p>
                {member.role === "팀장" ? <Badge tone="blue">팀장</Badge> : null}
              </div>
              <p className="truncate text-xs text-slate-500">{member.email}</p>
            </div>
            <Badge>{member.squad}</Badge>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function LeaderboardCard() {
  const rankedMembers = [...members].sort((a, b) => b.score - a.score);

  return (
    <SectionCard className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-950">리더보드</h2>
        <span className="text-xs font-semibold text-slate-400">이번 주</span>
      </div>
      <div className="space-y-3">
        {rankedMembers.map((member, index) => (
          <div key={member.name} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-500">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">{member.name}</span>
            <span className="text-sm font-bold text-slate-950">{member.score}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export default function TeamInfoPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <TeamHeader />

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_368px]">
        <div className="space-y-6">
          <TeamGoalCard />
          <MissionCard />
          <ProblemBoard />
          <TeamActivity />
        </div>

        <aside className="space-y-5 xl:sticky xl:top-32 xl:self-start">
          <RecommendationInfo />
          <MembersCard />
          <LeaderboardCard />
        </aside>
      </div>
    </main>
  );
}
