import Link from "next/link";
import { RecordCreateForm } from "@/components/record/record-create-form";

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

const checklistItems = [
  "문제 정보를 입력합니다",
  "통과한 풀이 코드를 붙여넣습니다",
  "실행 시간과 메모리를 선택 입력합니다",
  "짧은 메모로 피드백을 요청합니다",
];

export default function NewRecordPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="border-b border-slate-200/80 pb-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <Link
              href="/record"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
            >
              <span aria-hidden="true">←</span>
              기록으로 돌아가기
            </Link>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.24em] text-teal-700">
              풀이 관리
            </p>
            <h1 className="mt-3 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              새 풀이 기록
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              풀이를 저장하고 리뷰를 위한 피드백 스레드를 시작하세요.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <RecordCreateForm />

        <aside className="space-y-5 xl:sticky xl:top-32 xl:self-start">
          <SectionCard className="p-5">
            <h2 className="text-base font-bold text-slate-950">체크리스트</h2>
            <div className="mt-4 space-y-3">
              {checklistItems.map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-700">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard className="p-5">
            <h2 className="text-base font-bold text-slate-950">
              현재 동작 범위
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              이 폼은 Supabase에 풀이 기록을 저장합니다. LeetCode 검증과 팀
              공유는 이후에 연결할 예정입니다.
            </p>
          </SectionCard>
        </aside>
      </div>
    </main>
  );
}
