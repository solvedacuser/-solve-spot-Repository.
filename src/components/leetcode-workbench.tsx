"use client";

import { useState, useTransition } from "react";
import type {
  ApiErrorPayload,
  LeetCodeBioResponse,
  LeetCodeCalendarResponse,
  LeetCodeContestResponse,
  LeetCodeDifficulty,
  LeetCodeLanguageResponse,
  LeetCodeRecommendationResponse,
  LeetCodeSkillResponse,
  LeetCodeUserResponse,
  LeetCodeVerifyProblemResponse,
} from "@/lib/leetcode/types";

type FetchState<T> = {
  data: T | null;
  error: ApiErrorPayload | null;
};

type DifficultySelection = Record<LeetCodeDifficulty, boolean>;

async function callApi<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const payload = await response.json();

  if (!response.ok) {
    throw payload.error as ApiErrorPayload;
  }

  return payload as T;
}

function splitList(value: string) {
  return value
    .split(/[\s,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function ToolCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-white/60 bg-white/80 p-6 shadow-panel backdrop-blur xl:p-7">
      <div className="mb-5">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-700">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {children}
    </section>
  );
}

function ErrorBanner({ error }: { error: ApiErrorPayload | null }) {
  if (!error) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      <div className="font-medium">{error.code}</div>
      <div className="mt-1">{error.message}</div>
    </div>
  );
}

function ResultField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-medium text-slate-900">{value}</div>
    </div>
  );
}

function SubmitButton({ disabled, pendingLabel, label }: { disabled: boolean; pendingLabel: string; label: string }) {
  return (
    <button
      type="submit"
      className="w-fit rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
      disabled={disabled}
    >
      {disabled ? pendingLabel : label}
    </button>
  );
}

export function LeetCodeWorkbench() {
  const [userInfoUsername, setUserInfoUsername] = useState("leetcode");
  const [bioUsername, setBioUsername] = useState("leetcode");
  const [languageUsername, setLanguageUsername] = useState("leetcode");
  const [skillUsername, setSkillUsername] = useState("leetcode");
  const [calendarUsername, setCalendarUsername] = useState("leetcode");
  const [calendarYear, setCalendarYear] = useState("2026");
  const [contestUsername, setContestUsername] = useState("leetcode");
  const [verifyUsername, setVerifyUsername] = useState("leetcode");
  const [verifyTitleSlug, setVerifyTitleSlug] = useState("two-sum");
  const [verifyRecentLimit, setVerifyRecentLimit] = useState("100");
  const [recommendUsernames, setRecommendUsernames] = useState("leetcode");
  const [recommendCount, setRecommendCount] = useState("5");
  const [recommendSkip, setRecommendSkip] = useState("0");
  const [recommendRecentLimit, setRecommendRecentLimit] = useState("100");
  const [recommendTagSlugs, setRecommendTagSlugs] = useState("array, dynamic-programming");
  const [difficulty, setDifficulty] = useState<DifficultySelection>({
    EASY: true,
    MEDIUM: true,
    HARD: false,
  });

  const [userInfoState, setUserInfoState] = useState<FetchState<LeetCodeUserResponse>>({
    data: null,
    error: null,
  });
  const [bioState, setBioState] = useState<FetchState<LeetCodeBioResponse>>({
    data: null,
    error: null,
  });
  const [languageState, setLanguageState] = useState<FetchState<LeetCodeLanguageResponse>>({
    data: null,
    error: null,
  });
  const [skillState, setSkillState] = useState<FetchState<LeetCodeSkillResponse>>({
    data: null,
    error: null,
  });
  const [calendarState, setCalendarState] = useState<FetchState<LeetCodeCalendarResponse>>({
    data: null,
    error: null,
  });
  const [contestState, setContestState] = useState<FetchState<LeetCodeContestResponse>>({
    data: null,
    error: null,
  });
  const [recommendState, setRecommendState] = useState<FetchState<LeetCodeRecommendationResponse>>({
    data: null,
    error: null,
  });
  const [verifyState, setVerifyState] = useState<FetchState<LeetCodeVerifyProblemResponse>>({
    data: null,
    error: null,
  });

  const [isUserPending, startUserTransition] = useTransition();
  const [isBioPending, startBioTransition] = useTransition();
  const [isLanguagePending, startLanguageTransition] = useTransition();
  const [isSkillPending, startSkillTransition] = useTransition();
  const [isCalendarPending, startCalendarTransition] = useTransition();
  const [isContestPending, startContestTransition] = useTransition();
  const [isRecommendPending, startRecommendTransition] = useTransition();
  const [isVerifyPending, startVerifyTransition] = useTransition();

  const submitUserInfo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startUserTransition(async () => {
      try {
        const data = await callApi<LeetCodeUserResponse>(
          `/api/leetcode/user?username=${encodeURIComponent(userInfoUsername.trim())}`,
        );
        setUserInfoState({ data, error: null });
      } catch (error) {
        setUserInfoState({ data: null, error: error as ApiErrorPayload });
      }
    });
  };

  const submitBio = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startBioTransition(async () => {
      try {
        const data = await callApi<LeetCodeBioResponse>(
          `/api/leetcode/bio?username=${encodeURIComponent(bioUsername.trim())}`,
        );
        setBioState({ data, error: null });
      } catch (error) {
        setBioState({ data: null, error: error as ApiErrorPayload });
      }
    });
  };

  const submitLanguage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startLanguageTransition(async () => {
      try {
        const data = await callApi<LeetCodeLanguageResponse>(
          `/api/leetcode/language?username=${encodeURIComponent(languageUsername.trim())}`,
        );
        setLanguageState({ data, error: null });
      } catch (error) {
        setLanguageState({ data: null, error: error as ApiErrorPayload });
      }
    });
  };

  const submitSkill = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startSkillTransition(async () => {
      try {
        const data = await callApi<LeetCodeSkillResponse>(
          `/api/leetcode/skill?username=${encodeURIComponent(skillUsername.trim())}`,
        );
        setSkillState({ data, error: null });
      } catch (error) {
        setSkillState({ data: null, error: error as ApiErrorPayload });
      }
    });
  };

  const submitCalendar = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startCalendarTransition(async () => {
      try {
        const data = await callApi<LeetCodeCalendarResponse>(
          `/api/leetcode/calendar?username=${encodeURIComponent(calendarUsername.trim())}&year=${encodeURIComponent(
            calendarYear.trim(),
          )}`,
        );
        setCalendarState({ data, error: null });
      } catch (error) {
        setCalendarState({ data: null, error: error as ApiErrorPayload });
      }
    });
  };

  const submitContest = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startContestTransition(async () => {
      try {
        const data = await callApi<LeetCodeContestResponse>(
          `/api/leetcode/contest?username=${encodeURIComponent(contestUsername.trim())}`,
        );
        setContestState({ data, error: null });
      } catch (error) {
        setContestState({ data: null, error: error as ApiErrorPayload });
      }
    });
  };

  const submitRecommend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startRecommendTransition(async () => {
      try {
        const selectedDifficulty = (Object.entries(difficulty) as Array<[LeetCodeDifficulty, boolean]>)
          .filter(([, selected]) => selected)
          .map(([value]) => value);

        const data = await callApi<LeetCodeRecommendationResponse>("/api/leetcode/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usernames: splitList(recommendUsernames),
            count: Number(recommendCount),
            difficulty: selectedDifficulty,
            tagSlugs: splitList(recommendTagSlugs),
            skip: Number(recommendSkip),
            recentAcceptedLimit: Number(recommendRecentLimit),
          }),
        });

        setRecommendState({ data, error: null });
      } catch (error) {
        setRecommendState({ data: null, error: error as ApiErrorPayload });
      }
    });
  };

  const submitVerify = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startVerifyTransition(async () => {
      try {
        const data = await callApi<LeetCodeVerifyProblemResponse>("/api/leetcode/verify-problem", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: verifyUsername.trim(),
            titleSlug: verifyTitleSlug.trim(),
            recentAcceptedLimit: Number(verifyRecentLimit),
          }),
        });

        setVerifyState({ data, error: null });
      } catch (error) {
        setVerifyState({ data: null, error: error as ApiErrorPayload });
      }
    });
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[36px] border border-white/60 bg-slate-950 px-6 py-10 text-white shadow-panel sm:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-cyan-300">CodeMate / LeetCode Draft</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              LeetCode GraphQL API workbench
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Local route handlers proxy public LeetCode profile, bio, recommendation, and recent accepted verification
              calls while keeping upstream GraphQL access on the server.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-amber-300">Current contract</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-200">
              <ResultField label="server" value="App Router Route Handlers + server-only LeetCode client" />
              <ResultField label="identifier" value="username + titleSlug" />
              <ResultField label="verification" value="SOLVED or UNKNOWN from recent accepted submissions" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <ToolCard
          eyebrow="User"
          title="Public profile lookup"
          description="Fetch profile metadata and aggregate solved counts for a public LeetCode username."
        >
          <form className="space-y-4" onSubmit={submitUserInfo}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Username</span>
              <input
                value={userInfoUsername}
                onChange={(event) => setUserInfoUsername(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                placeholder="leetcode"
              />
            </label>
            <SubmitButton disabled={isUserPending} pendingLabel="Loading..." label="Lookup" />
          </form>
          <div className="mt-4">
            <ErrorBanner error={userInfoState.error} />
          </div>
          {userInfoState.data ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ResultField label="Username" value={userInfoState.data.username} />
              <ResultField label="Ranking" value={userInfoState.data.profile.ranking ?? "Unranked"} />
              <ResultField label="Reputation" value={userInfoState.data.profile.reputation} />
              <ResultField label="Total solved" value={userInfoState.data.solved.total} />
              <ResultField label="Easy" value={userInfoState.data.solved.easy} />
              <ResultField label="Medium" value={userInfoState.data.solved.medium} />
              <ResultField label="Hard" value={userInfoState.data.solved.hard} />
            </div>
          ) : null}
        </ToolCard>

        <ToolCard
          eyebrow="Bio"
          title="Profile bio lookup"
          description="Read the public profile bio and normalize missing bio content to an empty string."
        >
          <form className="space-y-4" onSubmit={submitBio}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Username</span>
              <input
                value={bioUsername}
                onChange={(event) => setBioUsername(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                placeholder="leetcode"
              />
            </label>
            <SubmitButton disabled={isBioPending} pendingLabel="Loading..." label="Lookup" />
          </form>
          <div className="mt-4">
            <ErrorBanner error={bioState.error} />
          </div>
          {bioState.data ? (
            <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Bio</div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {bioState.data.bio || "No public bio."}
              </p>
            </div>
          ) : null}
        </ToolCard>

        <ToolCard
          eyebrow="Language"
          title="Language stats"
          description="Fetch public solved counts by programming language for a LeetCode username."
        >
          <form className="space-y-4" onSubmit={submitLanguage}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Username</span>
              <input
                value={languageUsername}
                onChange={(event) => setLanguageUsername(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                placeholder="leetcode"
              />
            </label>
            <SubmitButton disabled={isLanguagePending} pendingLabel="Loading..." label="Lookup" />
          </form>
          <div className="mt-4">
            <ErrorBanner error={languageState.error} />
          </div>
          {languageState.data ? (
            <div className="mt-4 overflow-hidden rounded-[24px] border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Language</th>
                    <th className="px-4 py-3 font-medium">Solved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {languageState.data.languages.map((item) => (
                    <tr key={item.languageName}>
                      <td className="px-4 py-3 font-medium text-slate-900">{item.languageName}</td>
                      <td className="px-4 py-3 text-slate-700">{item.problemsSolved}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </ToolCard>

        <ToolCard
          eyebrow="Skill"
          title="Tag skill stats"
          description="Read public solved counts by LeetCode skill group and topic tag."
        >
          <form className="space-y-4" onSubmit={submitSkill}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Username</span>
              <input
                value={skillUsername}
                onChange={(event) => setSkillUsername(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                placeholder="leetcode"
              />
            </label>
            <SubmitButton disabled={isSkillPending} pendingLabel="Loading..." label="Lookup" />
          </form>
          <div className="mt-4">
            <ErrorBanner error={skillState.error} />
          </div>
          {skillState.data ? (
            <div className="mt-4 grid gap-4">
              {(["fundamental", "intermediate", "advanced"] as const).map((groupName) => (
                <div key={groupName} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{groupName}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {skillState.data!.groups[groupName].length > 0 ? (
                      skillState.data!.groups[groupName].map((item) => (
                        <span
                          key={item.tagSlug}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-700"
                        >
                          {item.tagName}: {item.problemsSolved}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">No public stats.</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </ToolCard>

        <ToolCard
          eyebrow="Calendar"
          title="Submission calendar"
          description="Fetch a public yearly activity summary and parsed submission calendar."
        >
          <form className="grid gap-4 md:grid-cols-[1fr_150px]" onSubmit={submitCalendar}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Username</span>
              <input
                value={calendarUsername}
                onChange={(event) => setCalendarUsername(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                placeholder="leetcode"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Year</span>
              <input
                type="number"
                min={2008}
                max={2100}
                value={calendarYear}
                onChange={(event) => setCalendarYear(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
              />
            </label>
            <div className="md:col-span-2">
              <SubmitButton disabled={isCalendarPending} pendingLabel="Loading..." label="Lookup" />
            </div>
          </form>
          <div className="mt-4">
            <ErrorBanner error={calendarState.error} />
          </div>
          {calendarState.data ? (
            <div className="mt-4 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <ResultField label="Year" value={calendarState.data.year} />
                <ResultField label="Streak" value={calendarState.data.streak} />
                <ResultField label="Active days" value={calendarState.data.totalActiveDays} />
                <ResultField label="Calendar entries" value={Object.keys(calendarState.data.submissionCalendar).length} />
                <ResultField label="Active years" value={calendarState.data.activeYears.join(", ") || "None"} />
                <ResultField label="Badges" value={calendarState.data.dccBadges.length} />
              </div>
              <div className="overflow-hidden rounded-[24px] border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Timestamp</th>
                      <th className="px-4 py-3 font-medium">Submissions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {Object.entries(calendarState.data.submissionCalendar)
                      .slice(0, 8)
                      .map(([timestamp, count]) => (
                        <tr key={timestamp}>
                          <td className="px-4 py-3 font-mono text-xs text-slate-600">{timestamp}</td>
                          <td className="px-4 py-3 text-slate-700">{count}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </ToolCard>

        <ToolCard
          eyebrow="Contest"
          title="Contest ranking"
          description="Fetch public contest ranking and contest history for a LeetCode username."
        >
          <form className="space-y-4" onSubmit={submitContest}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Username</span>
              <input
                value={contestUsername}
                onChange={(event) => setContestUsername(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                placeholder="leetcode"
              />
            </label>
            <SubmitButton disabled={isContestPending} pendingLabel="Loading..." label="Lookup" />
          </form>
          <div className="mt-4">
            <ErrorBanner error={contestState.error} />
          </div>
          {contestState.data ? (
            <div className="mt-4 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <ResultField
                  label="Rating"
                  value={contestState.data.ranking ? contestState.data.ranking.rating.toFixed(1) : "Unrated"}
                />
                <ResultField
                  label="Global rank"
                  value={contestState.data.ranking?.globalRanking ?? "Unranked"}
                />
                <ResultField
                  label="Attended"
                  value={contestState.data.ranking?.attendedContestsCount ?? 0}
                />
                <ResultField label="History rows" value={contestState.data.history.length} />
              </div>
              <div className="overflow-hidden rounded-[24px] border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Contest</th>
                        <th className="px-4 py-3 font-medium">Solved</th>
                        <th className="px-4 py-3 font-medium">Ranking</th>
                        <th className="px-4 py-3 font-medium">Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {contestState.data.history.slice(0, 6).map((item) => (
                        <tr key={`${item.contest.title}-${item.contest.startTime}`}>
                          <td className="px-4 py-3 font-medium text-slate-900">{item.contest.title}</td>
                          <td className="px-4 py-3 text-slate-700">
                            {item.problemsSolved}/{item.totalProblems}
                          </td>
                          <td className="px-4 py-3 text-slate-700">{item.ranking}</td>
                          <td className="px-4 py-3 text-slate-700">{item.rating.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}
        </ToolCard>

        <ToolCard
          eyebrow="Recommend"
          title="Problem recommendation"
          description="Return public problem candidates and exclude only title slugs found in recent accepted submissions."
        >
          <form className="grid gap-4" onSubmit={submitRecommend}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Usernames</span>
              <textarea
                value={recommendUsernames}
                onChange={(event) => setRecommendUsernames(event.target.value)}
                className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                placeholder={"leetcode\nalice"}
              />
            </label>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Count</span>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={recommendCount}
                  onChange={(event) => setRecommendCount(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Skip</span>
                <input
                  type="number"
                  min={0}
                  value={recommendSkip}
                  onChange={(event) => setRecommendSkip(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Recent limit</span>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={recommendRecentLimit}
                  onChange={(event) => setRecommendRecentLimit(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                />
              </label>
            </div>
            <div>
              <span className="mb-2 block text-sm font-medium text-slate-700">Difficulty</span>
              <div className="flex flex-wrap gap-3">
                {(Object.keys(difficulty) as LeetCodeDifficulty[]).map((value) => (
                  <label
                    key={value}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={difficulty[value]}
                      onChange={(event) =>
                        setDifficulty((current) => ({
                          ...current,
                          [value]: event.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-slate-300 text-cyan-700"
                    />
                    {value}
                  </label>
                ))}
              </div>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Tag slugs</span>
              <input
                value={recommendTagSlugs}
                onChange={(event) => setRecommendTagSlugs(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                placeholder="array, dynamic-programming"
              />
            </label>
            <SubmitButton disabled={isRecommendPending} pendingLabel="Searching..." label="Recommend" />
          </form>
          <div className="mt-4">
            <ErrorBanner error={recommendState.error} />
          </div>
          {recommendState.data ? (
            <div className="mt-5 space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <ResultField label="Exclusion" value={recommendState.data.exclusion.mode} />
                <ResultField label="Checked limit" value={recommendState.data.exclusion.checkedLimit} />
                <ResultField label="Users" value={recommendState.data.exclusion.usernames.join(", ") || "None"} />
              </div>
              <div className="overflow-hidden rounded-[24px] border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Problem</th>
                        <th className="px-4 py-3 font-medium">Difficulty</th>
                        <th className="px-4 py-3 font-medium">Acceptance</th>
                        <th className="px-4 py-3 font-medium">Tags</th>
                        <th className="px-4 py-3 font-medium">Link</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {recommendState.data.items.map((item) => (
                        <tr key={item.titleSlug}>
                          <td className="px-4 py-3">
                            <div className="font-medium text-slate-900">{item.title}</div>
                            <div className="mt-1 font-mono text-xs text-slate-500">
                              #{item.questionFrontendId} / {item.titleSlug}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-700">{item.difficulty}</td>
                          <td className="px-4 py-3 text-slate-700">{item.acRate.toFixed(1)}%</td>
                          <td className="max-w-64 px-4 py-3 text-slate-700">
                            {item.tags.map((tag) => tag.slug).join(", ") || "None"}
                          </td>
                          <td className="px-4 py-3">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-700 underline decoration-cyan-200 underline-offset-4"
                            >
                              Open
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : null}
        </ToolCard>

        <ToolCard
          eyebrow="Verify"
          title="Recent accepted verification"
          description="Check whether a title slug appears in a user's recent accepted submissions."
        >
          <form className="grid gap-4 md:grid-cols-[1fr_1fr_150px]" onSubmit={submitVerify}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Username</span>
              <input
                value={verifyUsername}
                onChange={(event) => setVerifyUsername(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                placeholder="leetcode"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Title slug</span>
              <input
                value={verifyTitleSlug}
                onChange={(event) => setVerifyTitleSlug(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
                placeholder="two-sum"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Limit</span>
              <input
                type="number"
                min={1}
                max={100}
                value={verifyRecentLimit}
                onChange={(event) => setVerifyRecentLimit(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
              />
            </label>
            <div className="md:col-span-3">
              <SubmitButton disabled={isVerifyPending} pendingLabel="Checking..." label="Verify" />
            </div>
          </form>
          <div className="mt-4">
            <ErrorBanner error={verifyState.error} />
          </div>
          {verifyState.data ? (
            <div className="mt-4 space-y-4">
              <div
                className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                  verifyState.data.status === "SOLVED"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {verifyState.data.status}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <ResultField label="Solved" value={String(verifyState.data.solved)} />
                <ResultField label="Source" value={verifyState.data.source.mode} />
                <ResultField label="Checked limit" value={verifyState.data.source.checkedLimit} />
                <ResultField label="Title slug" value={verifyState.data.titleSlug} />
              </div>
              {verifyState.data.reason ? (
                <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                  {verifyState.data.reason}
                </div>
              ) : null}
            </div>
          ) : null}
        </ToolCard>
      </section>
    </main>
  );
}
