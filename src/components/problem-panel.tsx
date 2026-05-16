"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, ExternalLink, Loader2, Search, ShieldCheck } from "lucide-react";
import type {
  ApiErrorPayload,
  LeetCodeDifficulty,
  LeetCodeProblem,
  LeetCodeRecommendationResponse,
  LeetCodeVerifyProblemResponse,
} from "@/lib/leetcode/types";

type FetchState<T> = {
  data: T | null;
  error: ApiErrorPayload | null;
};

type DifficultySelection = Record<LeetCodeDifficulty, boolean>;

type VerifyState = {
  data: LeetCodeVerifyProblemResponse | null;
  error: ApiErrorPayload | null;
  pending: boolean;
};

const RANDOM_SKIP_MAX = 200;

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

function difficultyClass(difficulty: LeetCodeDifficulty) {
  switch (difficulty) {
    case "EASY":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "MEDIUM":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "HARD":
      return "border-rose-200 bg-rose-50 text-rose-700";
  }
}

function ErrorBanner({ error }: { error: ApiErrorPayload | null }) {
  if (!error) {
    return null;
  }

  return (
    <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
      <div className="font-semibold">{error.code}</div>
      <div className="mt-1">{error.message}</div>
    </div>
  );
}

function ProblemCard({
  problem,
  verifyUsername,
  recentAcceptedLimit,
  verifyState,
  solved,
  onVerify,
}: {
  problem: LeetCodeProblem;
  verifyUsername: string;
  recentAcceptedLimit: number;
  verifyState: VerifyState | undefined;
  solved: boolean;
  onVerify: (problem: LeetCodeProblem) => void;
}) {
  const status = verifyState?.data?.status;
  const isUnknown = status === "UNKNOWN";

  return (
    <article
      className={[
        "rounded-lg border bg-white p-5 shadow-sm transition",
        solved ? "border-emerald-300 ring-2 ring-emerald-100" : "border-slate-200",
        isUnknown ? "border-amber-300 ring-2 ring-amber-100" : "",
      ].join(" ")}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-600">
              #{problem.questionFrontendId}
            </span>
            <span className={`rounded-md border px-2 py-1 text-xs font-semibold ${difficultyClass(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
            {problem.paidOnly ? (
              <span className="rounded-md border border-violet-200 bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-700">
                Paid
              </span>
            ) : null}
            {solved ? (
              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Solved
              </span>
            ) : null}
          </div>

          <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{problem.title}</h2>
          <p className="mt-1 break-all font-mono text-xs text-slate-500">{problem.titleSlug}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {problem.tags.length > 0 ? (
              problem.tags.slice(0, 6).map((tag) => (
                <span key={tag.slug} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                  {tag.slug}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">No tags</span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 md:justify-end">
          <a
            href={problem.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            <ExternalLink className="h-4 w-4" />
            Open
          </a>
          <button
            type="button"
            onClick={() => onVerify(problem)}
            disabled={Boolean(verifyState?.pending) || !verifyUsername.trim()}
            className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {verifyState?.pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            Verify
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div className="rounded-lg bg-slate-50 px-3 py-2">
          <div className="text-xs font-medium uppercase text-slate-500">Acceptance</div>
          <div className="mt-1 font-semibold text-slate-900">{problem.acRate.toFixed(1)}%</div>
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2">
          <div className="text-xs font-medium uppercase text-slate-500">Verify user</div>
          <div className="mt-1 break-all font-semibold text-slate-900">{verifyUsername.trim() || "Required"}</div>
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2">
          <div className="text-xs font-medium uppercase text-slate-500">Recent limit</div>
          <div className="mt-1 font-semibold text-slate-900">{recentAcceptedLimit}</div>
        </div>
      </div>

      <div className="mt-4">
        <ErrorBanner error={verifyState?.error ?? null} />
      </div>

      {verifyState?.data ? (
        <div
          className={[
            "mt-4 rounded-lg border px-4 py-3 text-sm",
            verifyState.data.status === "SOLVED"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-800",
          ].join(" ")}
        >
          <div className="font-semibold">{verifyState.data.status}</div>
          <div className="mt-1">
            {verifyState.data.status === "SOLVED"
              ? "Found in recent accepted submissions."
              : verifyState.data.reason || "Not found in recent accepted submissions."}
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function ProblemPanel() {
  const [usernames, setUsernames] = useState("leetcode");
  const [tagSlugs, setTagSlugs] = useState("array dynamic-programming");
  const [count, setCount] = useState("5");
  const [recentAcceptedLimit, setRecentAcceptedLimit] = useState("100");
  const [verifyUsername, setVerifyUsername] = useState("leetcode");
  const [difficulty, setDifficulty] = useState<DifficultySelection>({
    EASY: true,
    MEDIUM: true,
    HARD: false,
  });

  const [recommendState, setRecommendState] = useState<FetchState<LeetCodeRecommendationResponse>>({
    data: null,
    error: null,
  });
  const [verifyStates, setVerifyStates] = useState<Record<string, VerifyState>>({});
  const [solvedSlugs, setSolvedSlugs] = useState<Set<string>>(new Set());
  const [lastRandomSkip, setLastRandomSkip] = useState<number | null>(null);
  const [isRecommendPending, startRecommendTransition] = useTransition();

  const parsedRecentLimit = Number(recentAcceptedLimit);
  const boundedRecentLimit = Number.isFinite(parsedRecentLimit) ? parsedRecentLimit : 100;

  const submitRecommend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startRecommendTransition(async () => {
      try {
        const randomSkip = Math.floor(Math.random() * (RANDOM_SKIP_MAX + 1));
        const selectedDifficulty = (Object.entries(difficulty) as Array<[LeetCodeDifficulty, boolean]>)
          .filter(([, selected]) => selected)
          .map(([value]) => value);

        const data = await callApi<LeetCodeRecommendationResponse>("/api/leetcode/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usernames: splitList(usernames),
            count: Number(count),
            difficulty: selectedDifficulty,
            tagSlugs: splitList(tagSlugs),
            skip: randomSkip,
            recentAcceptedLimit: Number(recentAcceptedLimit),
          }),
        });

        setRecommendState({ data, error: null });
        setLastRandomSkip(randomSkip);
        setVerifyStates({});
        setSolvedSlugs(new Set());
      } catch (error) {
        setRecommendState({ data: null, error: error as ApiErrorPayload });
      }
    });
  };

  const verifyProblem = async (problem: LeetCodeProblem) => {
    const titleSlug = problem.titleSlug;

    setVerifyStates((current) => ({
      ...current,
      [titleSlug]: {
        data: current[titleSlug]?.data ?? null,
        error: null,
        pending: true,
      },
    }));

    try {
      const data = await callApi<LeetCodeVerifyProblemResponse>("/api/leetcode/verify-problem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: verifyUsername.trim(),
          titleSlug,
          recentAcceptedLimit: Number(recentAcceptedLimit),
        }),
      });

      setVerifyStates((current) => ({
        ...current,
        [titleSlug]: {
          data,
          error: null,
          pending: false,
        },
      }));

      if (data.status === "SOLVED") {
        setSolvedSlugs((current) => {
          const next = new Set(current);
          next.add(titleSlug);
          return next;
        });
      }
    } catch (error) {
      setVerifyStates((current) => ({
        ...current,
        [titleSlug]: {
          data: null,
          error: error as ApiErrorPayload,
          pending: false,
        },
      }));
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <section className="rounded-lg border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">
              LeetCode Problem
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Problem recommendation and verification
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              Recommendations exclude only problems found in recent accepted submissions. Verification reports SOLVED
              when the title slug appears in recent accepted submissions, otherwise UNKNOWN.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <div className="font-semibold text-slate-900">Local endpoints only</div>
            <div className="mt-2 font-mono text-xs leading-6 text-slate-600">
              POST /api/leetcode/recommend
              <br />
              POST /api/leetcode/verify-problem
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        <aside className="h-fit rounded-lg border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
          <form className="space-y-5" onSubmit={submitRecommend}>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-950">Recommendation</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">Set team usernames and filters.</p>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Team usernames</span>
              <textarea
                value={usernames}
                onChange={(event) => setUsernames(event.target.value)}
                className="min-h-24 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                placeholder={"alice\nbob"}
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Count</span>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={count}
                  onChange={(event) => setCount(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Recent limit</span>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={recentAcceptedLimit}
                  onChange={(event) => setRecentAcceptedLimit(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                />
              </label>
            </div>

            <div>
              <span className="mb-2 block text-sm font-medium text-slate-700">Difficulty</span>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(difficulty) as LeetCodeDifficulty[]).map((value) => (
                  <label
                    key={value}
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs font-semibold text-slate-700"
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
                value={tagSlugs}
                onChange={(event) => setTagSlugs(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                placeholder="array dynamic-programming"
              />
            </label>

            <button
              type="submit"
              disabled={isRecommendPending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRecommendPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Recommend
            </button>
          </form>

          <div className="mt-6 border-t border-slate-200 pt-5">
            <h2 className="text-lg font-semibold tracking-tight text-slate-950">Verification</h2>
            <label className="mt-3 block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Your username</span>
              <input
                value={verifyUsername}
                onChange={(event) => setVerifyUsername(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
                placeholder="alice"
              />
            </label>
          </div>
        </aside>

        <section className="min-w-0">
          <ErrorBanner error={recommendState.error} />

          {recommendState.data ? (
            <div className="mb-4 rounded-lg border border-slate-200 bg-white/90 p-4 text-sm text-slate-600 shadow-sm backdrop-blur">
              <div className="grid gap-3 md:grid-cols-4">
                <div>
                  <span className="font-semibold text-slate-900">Exclusion:</span>{" "}
                  {recommendState.data.exclusion.mode}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Random skip:</span>{" "}
                  {lastRandomSkip ?? 0}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Checked limit:</span>{" "}
                  {recommendState.data.exclusion.checkedLimit}
                </div>
                <div className="break-all">
                  <span className="font-semibold text-slate-900">Users:</span>{" "}
                  {recommendState.data.exclusion.usernames.join(", ") || "None"}
                </div>
              </div>
            </div>
          ) : null}

          {recommendState.data?.items.length ? (
            <div className="grid gap-4">
              {recommendState.data.items.map((problem) => (
                <ProblemCard
                  key={problem.titleSlug}
                  problem={problem}
                  verifyUsername={verifyUsername}
                  recentAcceptedLimit={boundedRecentLimit}
                  verifyState={verifyStates[problem.titleSlug]}
                  solved={solvedSlugs.has(problem.titleSlug)}
                  onVerify={verifyProblem}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white/70 p-8 text-center text-sm text-slate-500">
              No recommendations yet.
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
