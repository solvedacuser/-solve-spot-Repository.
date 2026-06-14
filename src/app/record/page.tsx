import Link from "next/link";
import { ZodError } from "zod";
import { RecordAppError } from "@/lib/record/errors";
import {
  listRecords,
  listRecordTeams,
  loadRecordInsights,
} from "@/lib/record/service";
import type {
  ListRecordsResponse,
  RecordDto,
  RecordInsightsResponse,
  RecordTeamDto,
} from "@/lib/record/types";
import { createClient } from "@/utils/supabase/server";

type RecordPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

type RecordPageQuery = {
  scope?: string;
  teamId?: string;
  from?: string;
  to?: string;
  limit?: string;
  q?: string;
  difficulty?: string;
  language?: string;
  status?: string;
};

const difficultyClasses = {
  Easy: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  Hard: "bg-rose-50 text-rose-700",
};

const difficultyLabels: Record<RecordDto["problem"]["difficulty"], string> = {
  Easy: "쉬움",
  Medium: "보통",
  Hard: "어려움",
};

const statusClasses = {
  Verified: "bg-emerald-50 text-emerald-700",
  "Review Requested": "bg-amber-50 text-amber-700",
  Draft: "bg-slate-100 text-slate-600",
};

const statusLabels: Record<RecordDto["status"], string> = {
  Verified: "확인 완료",
  "Review Requested": "리뷰 요청",
  Draft: "초안",
};

const roleLabels: Record<RecordDto["author"]["role"], string> = {
  "Team Lead": "팀장",
  Member: "팀원",
};

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
        "rounded-xl border border-slate-200 bg-white shadow-sm",
        className,
      )}
    >
      {children}
    </section>
  );
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cx("rounded-md px-2.5 py-1 text-xs font-semibold", className)}
    >
      {children}
    </span>
  );
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function optionalParam(value: string | string[] | undefined) {
  const param = firstParam(value);
  return param?.trim() ? param.trim() : undefined;
}

async function normalizeSearchParams(
  searchParams: RecordPageProps["searchParams"],
): Promise<RecordPageQuery> {
  const params = searchParams ? await searchParams : {};

  return {
    scope: optionalParam(params.scope),
    teamId: optionalParam(params.teamId),
    from: optionalParam(params.from),
    to: optionalParam(params.to),
    limit: optionalParam(params.limit) ?? "50",
    q: optionalParam(params.q),
    difficulty: optionalParam(params.difficulty),
    language: optionalParam(params.language),
    status: optionalParam(params.status),
  };
}

async function loadPageData(query: RecordPageQuery) {
  const supabase = await createClient();
  let data: ListRecordsResponse = { items: [] };
  let error: RecordAppError | null = null;
  let teams: RecordTeamDto[] = [];
  let insights: RecordInsightsResponse | null = null;
  let insightsError: RecordAppError | null = null;

  try {
    data = await listRecords(supabase, query);
  } catch (recordError) {
    if (recordError instanceof RecordAppError) {
      return { data, error: recordError, teams, insights, insightsError };
    }

    if (recordError instanceof ZodError) {
      return {
        data,
        error: new RecordAppError(
          "BAD_REQUEST",
          400,
          recordError.issues[0]?.message,
        ),
        teams,
        insights,
        insightsError,
      };
    }

    throw recordError;
  }

  try {
    teams = await listRecordTeams(supabase);
  } catch (teamError) {
    if (!(teamError instanceof RecordAppError)) {
      throw teamError;
    }
  }

  if (query.scope === "team" || query.scope === "allTeams") {
    try {
      insights = await loadRecordInsights(supabase, {
        scope: query.scope,
        ...(query.scope === "team" ? { teamId: query.teamId } : {}),
      });
    } catch (loadInsightsError) {
      if (loadInsightsError instanceof RecordAppError) {
        insightsError = loadInsightsError;
      } else {
        throw loadInsightsError;
      }
    }
  }

  return { data, error, teams, insights, insightsError };
}

function formatSubmittedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatDateOnly(value: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
  }).format(date);
}

function buildRecordHref(
  query: RecordPageQuery,
  updates: Partial<RecordPageQuery>,
) {
  const params = new URLSearchParams();
  const next = {
    ...query,
    ...updates,
  };

  for (const key of [
    "scope",
    "teamId",
    "from",
    "to",
    "limit",
    "q",
    "difficulty",
    "language",
    "status",
  ] as const) {
    const value = next[key];

    if (value) {
      params.set(key, value);
    }
  }

  const search = params.toString();
  return search ? `/record?${search}` : "/record";
}

function HiddenRecordQueryFields({ query }: { query: RecordPageQuery }) {
  return (
    <>
      {query.scope ? (
        <input type="hidden" name="scope" value={query.scope} />
      ) : null}
      <input type="hidden" name="limit" value={query.limit ?? "50"} />
      {query.language ? (
        <input type="hidden" name="language" value={query.language} />
      ) : null}
    </>
  );
}

function RecordHeader() {
  return (
    <section className="border-b border-slate-200 pb-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
            기록 관리
          </p>
          <h1 className="mt-3 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
            풀이 기록
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            개인 기록과 팀 기록을 한 화면에서 확인하세요.
          </p>
        </div>

        <Link
          href="/record/new"
          className="inline-flex h-11 w-fit items-center gap-2 rounded-xl bg-teal-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
        >
          <span aria-hidden="true">+</span>
          기록 추가
        </Link>
      </div>
    </section>
  );
}

function RecordScopeTabs({
  query,
  teams,
}: {
  query: RecordPageQuery;
  teams: RecordTeamDto[];
}) {
  const currentScope = query.scope ?? "mine";
  const firstTeamId = teams[0] ? String(teams[0].id) : undefined;
  const tabs = [
    {
      scope: "mine",
      label: "내 기록",
      href: buildRecordHref(query, { scope: "mine", teamId: undefined }),
    },
    {
      scope: "team",
      label: "팀 기록",
      href: buildRecordHref(query, {
        scope: "team",
        teamId: query.teamId ?? firstTeamId,
      }),
    },
    {
      scope: "allTeams",
      label: "전체 팀 기록",
      href: buildRecordHref(query, { scope: "allTeams", teamId: undefined }),
    },
  ];

  return (
    <nav className="flex shrink-0 flex-wrap gap-2" aria-label="기록 범위">
      {tabs.map((tab) => (
        <Link
          key={tab.scope}
          href={tab.href}
          className={cx(
            "h-11 rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
            currentScope === tab.scope
              ? "border-slate-950 bg-slate-950 text-white"
              : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

function RecordFilters({
  query,
  teams,
}: {
  query: RecordPageQuery;
  teams: RecordTeamDto[];
}) {
  const currentScope = query.scope ?? "mine";
  const selectedTeamAvailable =
    currentScope !== "team" ||
    !query.teamId ||
    teams.some((team) => String(team.id) === query.teamId);

  return (
    <SectionCard className="p-4">
      <form className="space-y-3">
        <HiddenRecordQueryFields query={query} />

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <label className="min-w-0 flex-1">
            <span className="sr-only">기록 검색</span>
            <input
              name="q"
              type="search"
              defaultValue={query.q}
              placeholder="기록 검색"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
            />
          </label>

          <RecordScopeTabs query={query} teams={teams} />
        </div>

        <div
          className={cx(
            "grid gap-3",
            currentScope === "team"
              ? "lg:grid-cols-[minmax(12rem,auto)_repeat(4,minmax(120px,auto))_auto]"
              : "lg:grid-cols-[repeat(4,minmax(120px,auto))_auto]",
          )}
        >
          {currentScope === "team" ? (
            <select
              name="teamId"
              aria-label="팀 선택"
              defaultValue={query.teamId ?? ""}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
            >
              <option value="" disabled>
                팀 선택
              </option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          ) : null}

          <select
            name="difficulty"
            aria-label="난이도"
            defaultValue={query.difficulty ?? ""}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
          >
            <option value="">전체 난이도</option>
            <option value="Easy">쉬움</option>
            <option value="Medium">보통</option>
            <option value="Hard">어려움</option>
          </select>

          <select
            name="status"
            aria-label="상태"
            defaultValue={query.status ?? ""}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
          >
            <option value="">전체 상태</option>
            <option value="Review Requested">리뷰 요청</option>
            <option value="Verified">확인 완료</option>
            <option value="Draft">초안</option>
          </select>

          <input
            name="from"
            type="date"
            aria-label="시작일"
            defaultValue={query.from ?? ""}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
          />

          <input
            name="to"
            type="date"
            aria-label="종료일"
            defaultValue={query.to ?? ""}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
          />

          <button
            type="submit"
            className="h-11 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            적용
          </button>
        </div>
      </form>

      {currentScope === "team" && teams.length === 0 ? (
        <p className="mt-3 text-sm font-medium text-amber-700">
          이 계정에서 선택할 수 있는 팀이 없습니다.
        </p>
      ) : null}
      {!selectedTeamAvailable ? (
        <p className="mt-3 text-sm font-medium text-rose-700">
          선택한 팀을 사용할 수 없습니다.
        </p>
      ) : null}
    </SectionCard>
  );
}

function RecordMetric({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  return (
    <div>
      <p className="text-base font-bold text-slate-950">{value || "-"}</p>
      <p className="mt-0.5 text-xs font-medium text-slate-400">{label}</p>
    </div>
  );
}

function SolutionCard({ record }: { record: RecordDto }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
            {record.author.avatarLabel}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-slate-950">{record.author.name}</h3>
              <Badge className="bg-slate-100 text-slate-600">
                {roleLabels[record.author.role]}
              </Badge>
            </div>
            <p className="text-xs font-medium text-slate-400">
              {formatSubmittedAt(record.submittedAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge className={statusClasses[record.status]}>
            {statusLabels[record.status]}
          </Badge>
          <span className="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-500">
            댓글 {record.comments}개
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-lg font-bold tracking-tight text-slate-950">
              {record.problem.title}
            </h4>
            <Badge className={difficultyClasses[record.problem.difficulty]}>
              {difficultyLabels[record.problem.difficulty]}
            </Badge>
            {record.problem.tags.map((tag) => (
              <Badge key={tag} className="bg-blue-50 text-blue-700">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <RecordMetric label="실행 시간" value={record.runtime} />
            <RecordMetric label="메모리" value={record.memory} />
          </div>
        </div>

        <Badge className="bg-slate-100 text-slate-700">{record.language}</Badge>
      </div>

      <pre
        aria-label="코드 미리보기"
        className="mt-5 max-h-56 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700"
      >
        <code>{record.code}</code>
      </pre>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        <Link
          href={`/record/${record.id}/feedback`}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          피드백 보기
        </Link>
      </div>
    </article>
  );
}

function RecordsEmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <h3 className="text-base font-bold text-slate-950">기록이 없습니다</h3>
      <p className="mt-2 text-sm text-slate-500">
        기록을 추가하거나 현재 필터를 조정해 주세요.
      </p>
      <Link
        href="/record/new"
        className="mt-5 inline-flex rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
      >
        기록 추가
      </Link>
    </div>
  );
}

function getRecordErrorMessage(error: RecordAppError) {
  if (error.code === "UNAUTHORIZED") {
    return "기록을 사용하려면 로그인해 주세요.";
  }

  if (error.code === "BAD_REQUEST") {
    return "선택한 필터를 확인하고 다시 시도해 주세요.";
  }

  if (error.code === "FORBIDDEN") {
    return "이 팀에 접근할 수 없습니다.";
  }

  return "요청을 완료하지 못했습니다.";
}

function ErrorState({ error }: { error: RecordAppError }) {
  if (error.code === "UNAUTHORIZED") {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-950">
          로그인이 필요합니다
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          기록을 보거나 만들려면 먼저 로그인해 주세요.
        </p>
        <Link
          href="/login"
          className="mt-5 inline-flex rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
        >
          로그인으로 이동
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-6">
      <h2 className="text-lg font-bold text-rose-950">
        기록을 불러오지 못했습니다
      </h2>
      <p className="mt-2 text-sm leading-6 text-rose-700">
        {getRecordErrorMessage(error)}
      </p>
    </div>
  );
}

function RecordSidebar({
  query,
  teams,
  insights,
  insightsError,
}: {
  query: RecordPageQuery;
  teams: RecordTeamDto[];
  insights: RecordInsightsResponse | null;
  insightsError: RecordAppError | null;
}) {
  const scope = query.scope ?? "mine";

  return (
    <aside className="space-y-5 xl:sticky xl:top-32 xl:self-start">
      <SectionCard className="p-5">
        <h2 className="text-base font-bold text-slate-950">팀 인사이트</h2>
        {scope === "mine" ? (
          <p className="mt-2 text-sm leading-6 text-slate-500">
            팀 범위로 전환하면 스트릭과 기여자 점수를 볼 수 있습니다.
          </p>
        ) : teams.length === 0 ? (
          <p className="mt-2 text-sm leading-6 text-slate-500">
            이 계정에서 사용할 수 있는 팀 데이터가 없습니다.
          </p>
        ) : insightsError ? (
          <p className="mt-2 text-sm leading-6 text-rose-600">
            {getRecordErrorMessage(insightsError)}
          </p>
        ) : insights ? (
          <div className="mt-4 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xl font-bold text-slate-950">
                  {insights.streak.currentStreakDays}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  현재 스트릭
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-bold text-slate-950">
                  {formatDateOnly(insights.streak.lastVerifiedAt)}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-500">
                  마지막 확인
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-950">상위 기여자</h3>
              {insights.topContributors.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {insights.topContributors.map((contributor) => (
                    <div
                      key={contributor.userId}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                        {contributor.avatarLabel}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {contributor.name}
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                          기록 {contributor.records}개 / 확인{" "}
                          {contributor.verifiedRecords}개 / 댓글{" "}
                          {contributor.feedbackComments}개
                        </p>
                      </div>
                      <span className="rounded-md bg-teal-50 px-2 py-1 text-xs font-bold text-teal-700">
                        {contributor.score}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  아직 기여 활동이 없습니다.
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm leading-6 text-slate-500">
            아직 표시할 인사이트가 없습니다.
          </p>
        )}
      </SectionCard>
    </aside>
  );
}

export default async function RecordPage({ searchParams }: RecordPageProps) {
  const query = await normalizeSearchParams(searchParams);
  const { data, error, teams, insights, insightsError } =
    await loadPageData(query);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <RecordHeader />

      <div className="mt-6">
        <RecordFilters query={query} teams={teams} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <SectionCard className="p-4">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">기록 피드</h2>
              <p className="mt-1 text-sm text-slate-500">
                선택한 범위와 필터에 맞는 기록입니다.
              </p>
            </div>
          </div>

          {error ? (
            <ErrorState error={error} />
          ) : data.items.length > 0 ? (
            <div className="space-y-4">
              {data.items.map((record) => (
                <SolutionCard key={record.id} record={record} />
              ))}
            </div>
          ) : (
            <RecordsEmptyState />
          )}
        </SectionCard>

        <RecordSidebar
          query={query}
          teams={teams}
          insights={insights}
          insightsError={insightsError}
        />
      </div>
    </main>
  );
}
