"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import type { RecordTeamDto } from "@/lib/record/types";

const inputClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100";

const selectClass =
  "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100";

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

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block min-w-0">
      <span className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </span>
      <div className="mt-2">{children}</div>
      {hint ? <span className="mt-1.5 block text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
}

function getString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function RecordCreateForm() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [teams, setTeams] = useState<RecordTeamDto[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadTeams() {
      try {
        const response = await fetch("/api/record/teams");

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as RecordTeamDto[];

        if (isMounted) {
          setTeams(data);
        }
      } catch {
        if (isMounted) {
          setTeams([]);
        }
      }
    }

    loadTeams();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setErrorMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const teamId = getString(formData, "teamId");
    const payload = {
      problemTitle: getString(formData, "problemTitle"),
      titleSlug: getString(formData, "titleSlug"),
      difficulty: getString(formData, "difficulty"),
      tags: parseTags(getString(formData, "tags")),
      language: getString(formData, "language"),
      runtime: getString(formData, "runtime"),
      memory: getString(formData, "memory"),
      status: getString(formData, "status"),
      code: getString(formData, "code"),
      reviewNote: getString(formData, "reviewNote"),
      ...(teamId ? { teamId: Number(teamId) } : {}),
    };

    try {
      const response = await fetch("/api/record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { id?: string };

      if (!response.ok) {
        setErrorMessage("풀이 기록을 저장하지 못했습니다. 입력값을 확인해주세요.");
        return;
      }

      if (!data.id) {
        setErrorMessage("저장된 기록의 id를 확인하지 못했습니다.");
        return;
      }

      router.push(`/record/${data.id}/feedback`);
      router.refresh();
    } catch {
      setErrorMessage("풀이 기록을 저장하지 못했습니다. 연결 상태를 확인한 뒤 다시 시도해주세요.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <SectionCard className="p-5">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-950">문제 정보</h2>
          <p className="mt-1 text-sm text-slate-500">
            문제 이름과 기본 분류를 입력해주세요.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="문제 제목">
            <input name="problemTitle" className={inputClass} placeholder="두 수의 합" type="text" required />
          </Field>
          <Field label="문제 슬러그" hint="문제 URL에 쓰이는 슬러그를 입력해주세요.">
            <input name="titleSlug" className={inputClass} placeholder="sample-problem" type="text" required />
          </Field>
          <Field label="난이도">
            <select name="difficulty" className={selectClass} defaultValue="Easy" aria-label="난이도">
              <option value="Easy">쉬움</option>
              <option value="Medium">보통</option>
              <option value="Hard">어려움</option>
            </select>
          </Field>
          <Field label="언어">
            <input name="language" className={inputClass} placeholder="TypeScript" type="text" required />
          </Field>
          <Field label="팀" hint="팀에 속하지 않는 기록이면 개인 기록으로 두세요.">
            <select name="teamId" className={selectClass} defaultValue="" aria-label="팀">
              <option value="">개인 기록</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="md:col-span-2">
            <Field label="태그" hint="쉼표로 구분해서 입력해주세요.">
              <input name="tags" className={inputClass} placeholder="Array, Hash Table" type="text" />
            </Field>
          </div>
        </div>
      </SectionCard>

      <SectionCard className="p-5">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-950">실행 정보</h2>
          <p className="mt-1 text-sm text-slate-500">
            실행 시간과 메모리는 선택 입력이지만, 리뷰할 때 도움이 됩니다.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="실행 시간">
            <input name="runtime" className={inputClass} placeholder="42ms" type="text" />
          </Field>
          <Field label="메모리">
            <input name="memory" className={inputClass} placeholder="16.2MB" type="text" />
          </Field>
          <Field label="상태">
            <select name="status" className={selectClass} defaultValue="Review Requested" aria-label="상태">
              <option value="Review Requested">리뷰 요청</option>
              <option value="Verified">확인 완료</option>
              <option value="Draft">초안</option>
            </select>
          </Field>
        </div>
      </SectionCard>

      <SectionCard className="p-5">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-950">풀이 코드</h2>
          <p className="mt-1 text-sm text-slate-500">
            리뷰받고 싶은 최종 풀이를 붙여넣어 주세요.
          </p>
        </div>

        <textarea
          name="code"
          aria-label="풀이 코드"
          className="min-h-[360px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-xs leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
          placeholder={`function twoSum(nums, target) {
  return [];
}`}
          required
        />
      </SectionCard>

      <SectionCard className="p-5">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-950">리뷰 메모</h2>
          <p className="mt-1 text-sm text-slate-500">
            피드백을 받을 때 참고할 맥락이나 질문을 남겨주세요.
          </p>
        </div>

        <textarea
          name="reviewNote"
          aria-label="리뷰 메모"
          className="min-h-32 w-full resize-y rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
          placeholder="엣지 케이스와 시간 복잡도를 함께 봐주세요."
        />
      </SectionCard>

      {errorMessage ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          onClick={() => router.push("/record")}
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isPending ? "저장 중..." : "기록 저장"}
        </button>
      </div>
    </form>
  );
}
