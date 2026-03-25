"use client";

import { useState, useTransition } from "react";
import type {
  ApiErrorPayload,
  ProblemInfo,
  SolvedAcUserBioResponse,
  SolvedAcUserResponse,
  VerifyProblemResponse,
} from "@/lib/solvedac/types";

type FetchState<T> = {
  data: T | null;
  error: ApiErrorPayload | null;
};

async function callApi<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  const payload = await response.json();

  if (!response.ok) {
    throw payload.error as ApiErrorPayload;
  }

  return payload as T;
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
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-teal-700">{eyebrow}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">{description}</p>
        </div>
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

export function SolvedAcWorkbench() {
  const [handleInfoHandle, setHandleInfoHandle] = useState("tourist");
  const [bioHandle, setBioHandle] = useState("tourist");
  const [verifyHandle, setVerifyHandle] = useState("tourist");
  const [verifyProblemId, setVerifyProblemId] = useState("1000");
  const [recommendHandles, setRecommendHandles] = useState("tourist\ncubelover");
  const [recommendCount, setRecommendCount] = useState("5");
  const [recommendMinLevel, setRecommendMinLevel] = useState("7");
  const [recommendMaxLevel, setRecommendMaxLevel] = useState("15");
  const [recommendTagKeys, setRecommendTagKeys] = useState("implementation, graph");

  const [handleInfoState, setHandleInfoState] = useState<FetchState<SolvedAcUserResponse>>({
    data: null,
    error: null,
  });
  const [bioState, setBioState] = useState<FetchState<SolvedAcUserBioResponse>>({
    data: null,
    error: null,
  });
  const [recommendState, setRecommendState] = useState<FetchState<{ items: ProblemInfo[] }>>({
    data: null,
    error: null,
  });
  const [verifyState, setVerifyState] = useState<FetchState<VerifyProblemResponse>>({
    data: null,
    error: null,
  });

  const [isHandlePending, startHandleTransition] = useTransition();
  const [isBioPending, startBioTransition] = useTransition();
  const [isRecommendPending, startRecommendTransition] = useTransition();
  const [isVerifyPending, startVerifyTransition] = useTransition();

  const submitHandleInfo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startHandleTransition(async () => {
      try {
        const data = await callApi<SolvedAcUserResponse>(`/api/solvedac/user?handle=${encodeURIComponent(handleInfoHandle.trim())}`);
        setHandleInfoState({ data, error: null });
      } catch (error) {
        setHandleInfoState({ data: null, error: error as ApiErrorPayload });
      }
    });
  };

  const submitBio = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startBioTransition(async () => {
      try {
        const data = await callApi<SolvedAcUserBioResponse>(`/api/solvedac/bio?handle=${encodeURIComponent(bioHandle.trim())}`);
        setBioState({ data, error: null });
      } catch (error) {
        setBioState({ data: null, error: error as ApiErrorPayload });
      }
    });
  };

  const submitRecommend = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startRecommendTransition(async () => {
      try {
        const handles = recommendHandles
          .split(/\s|,/)
          .map((value) => value.trim())
          .filter(Boolean);
        const tagKeys = recommendTagKeys
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);

        const data = await callApi<{ items: ProblemInfo[] }>("/api/solvedac/recommend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            handles,
            count: Number(recommendCount),
            minLevel: Number(recommendMinLevel),
            maxLevel: Number(recommendMaxLevel),
            tagKeys,
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
        const data = await callApi<VerifyProblemResponse>("/api/solvedac/verify-problem", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            handle: verifyHandle.trim(),
            problemId: Number(verifyProblemId),
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
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-teal-300">CodeMate / Solved.ac Draft</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              solved.ac 연동 로직을 Next.js 풀스택 초안으로 다시 묶은 작업용 콘솔
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              기존 Spring 구현의 쿼리 생성 규칙을 그대로 가져오고, handle 조회, bio 조회, 문제 추천,
              특정 문제 풀이 검증을 모두 서버 Route Handler 뒤로 숨긴 상태입니다.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-orange-300">What is inside</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-200">
              <ResultField label="server" value="App Router Route Handlers + server-only solved.ac client" />
              <ResultField label="input" value="익명 handle 기반 도구형 UX" />
              <ResultField label="storage" value="무저장, GET 요청만 짧은 TTL 캐시" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <ToolCard
          eyebrow="Handle Info"
          title="사용자 기본 정보 조회"
          description="solved.ac `/user/show` 응답에서 handle, tier, solvedCount, maxStreak, rating만 추려서 확인합니다."
        >
          <form className="space-y-4" onSubmit={submitHandleInfo}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Handle</span>
              <input
                value={handleInfoHandle}
                onChange={(event) => setHandleInfoHandle(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                placeholder="tourist"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
              disabled={isHandlePending}
            >
              {isHandlePending ? "불러오는 중..." : "조회"}
            </button>
          </form>
          <div className="mt-4">
            <ErrorBanner error={handleInfoState.error} />
          </div>
          {handleInfoState.data ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <ResultField label="Handle" value={handleInfoState.data.handle} />
              <ResultField label="Tier" value={handleInfoState.data.tier} />
              <ResultField label="Solved Count" value={handleInfoState.data.solvedCount} />
              <ResultField label="Rating" value={handleInfoState.data.rating} />
              <ResultField label="Max Streak" value={handleInfoState.data.maxStreak} />
            </div>
          ) : null}
        </ToolCard>

        <ToolCard
          eyebrow="Bio Lookup"
          title="bio 조회"
          description="handle 기준으로 같은 solved.ac `/user/show` 엔드포인트를 호출하되 bio 필드만 노출합니다."
        >
          <form className="space-y-4" onSubmit={submitBio}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Handle</span>
              <input
                value={bioHandle}
                onChange={(event) => setBioHandle(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                placeholder="tourist"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
              disabled={isBioPending}
            >
              {isBioPending ? "불러오는 중..." : "조회"}
            </button>
          </form>
          <div className="mt-4">
            <ErrorBanner error={bioState.error} />
          </div>
          {bioState.data ? (
            <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Bio</div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {bioState.data.bio || "bio가 비어 있습니다."}
              </p>
            </div>
          ) : null}
        </ToolCard>

        <ToolCard
          eyebrow="Recommend"
          title="추천 쿼리 빌더"
          description="Spring 구현과 동일하게 난이도 범위, 태그 필터, 이미 푼 사용자 제외 조건을 합쳐 solved.ac 추천 쿼리를 생성합니다."
        >
          <form className="grid gap-4" onSubmit={submitRecommend}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Handles</span>
              <textarea
                value={recommendHandles}
                onChange={(event) => setRecommendHandles(event.target.value)}
                className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                placeholder={"tourist\ncubelover"}
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
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Min Level</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={recommendMinLevel}
                  onChange={(event) => setRecommendMinLevel(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Max Level</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={recommendMaxLevel}
                  onChange={(event) => setRecommendMaxLevel(event.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Tag Keys</span>
              <input
                value={recommendTagKeys}
                onChange={(event) => setRecommendTagKeys(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
                placeholder="implementation, graph, dp"
              />
            </label>
            <button
              type="submit"
              className="w-fit rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              disabled={isRecommendPending}
            >
              {isRecommendPending ? "검색 중..." : "추천 요청"}
            </button>
          </form>
          <div className="mt-4">
            <ErrorBanner error={recommendState.error} />
          </div>
          {recommendState.data ? (
            <div className="mt-5 overflow-hidden rounded-[24px] border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Problem</th>
                      <th className="px-4 py-3 font-medium">Level</th>
                      <th className="px-4 py-3 font-medium">Accepted</th>
                      <th className="px-4 py-3 font-medium">Avg Tries</th>
                      <th className="px-4 py-3 font-medium">Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {recommendState.data.items.map((item) => (
                      <tr key={item.problemId}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">{item.titleKo || `Problem ${item.problemId}`}</div>
                          <div className="mt-1 font-mono text-xs text-slate-500">#{item.problemId}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{item.level}</td>
                        <td className="px-4 py-3 text-slate-700">{item.acceptedUserCount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-slate-700">{item.averageTries.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-teal-700 underline decoration-teal-200 underline-offset-4"
                          >
                            BOJ 열기
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </ToolCard>

        <ToolCard
          eyebrow="Verify"
          title="특정 문제 풀이 검증"
          description="`id:{problemId}+s@{handle}` 쿼리로 문제 풀이 여부를 판정하고, 생성된 raw query도 같이 노출합니다."
        >
          <form className="grid gap-4 md:grid-cols-[1fr_180px_auto]" onSubmit={submitVerify}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Handle</span>
              <input
                value={verifyHandle}
                onChange={(event) => setVerifyHandle(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                placeholder="tourist"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Problem ID</span>
              <input
                type="number"
                min={1}
                value={verifyProblemId}
                onChange={(event) => setVerifyProblemId(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                placeholder="1000"
              />
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
                disabled={isVerifyPending}
              >
                {isVerifyPending ? "검증 중..." : "검증"}
              </button>
            </div>
          </form>
          <div className="mt-4">
            <ErrorBanner error={verifyState.error} />
          </div>
          {verifyState.data ? (
            <div className="mt-4 space-y-4">
              <div
                className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${
                  verifyState.data.solved ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700"
                }`}
              >
                {verifyState.data.solved ? "Solved" : "Not Solved"}
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-950 p-4 text-sm text-slate-100">
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">Query</div>
                <code className="mt-3 block break-all font-mono text-teal-300">{verifyState.data.query}</code>
              </div>
            </div>
          ) : null}
        </ToolCard>
      </section>
    </main>
  );
}
