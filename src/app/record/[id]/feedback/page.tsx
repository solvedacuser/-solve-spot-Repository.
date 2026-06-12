import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ZodError } from "zod";
import { FeedbackForm } from "@/components/record/feedback-form";
import { RecordAppError } from "@/lib/record/errors";
import { loadRecordDetail } from "@/lib/record/service";
import type {
  FeedbackCommentDto,
  RecordDetailResponse,
} from "@/lib/record/types";
import { createClient } from "@/utils/supabase/server";

const difficultyClasses = {
  Easy: "bg-emerald-50 text-emerald-700",
  Medium: "bg-amber-50 text-amber-700",
  Hard: "bg-rose-50 text-rose-700",
};

const difficultyLabels = {
  Easy: "쉬움",
  Medium: "보통",
  Hard: "어려움",
};

const roleLabels = {
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
  children: ReactNode;
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
  className,
}: {
  children: ReactNode;
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

type RecordFeedbackPageProps = {
  params: Promise<{ id: string }>;
};

async function loadPageDetail(id: string) {
  const supabase = await createClient();

  try {
    return {
      data: await loadRecordDetail(supabase, id),
      error: null,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      notFound();
    }

    if (error instanceof RecordAppError) {
      if (error.code === "NOT_FOUND") {
        notFound();
      }

      return {
        data: null,
        error,
      };
    }

    throw error;
  }
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

function getRecordErrorMessage(error: RecordAppError) {
  if (error.code === "UNAUTHORIZED") {
    return "피드백을 보려면 먼저 로그인해주세요.";
  }

  if (error.code === "BAD_REQUEST") {
    return "입력값을 확인해주세요.";
  }

  return "요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.";
}

function ErrorState({ error }: { error: RecordAppError }) {
  if (error.code === "UNAUTHORIZED") {
    return (
      <SectionCard className="p-6">
        <h2 className="text-lg font-bold text-slate-950">
          로그인이 필요합니다
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          풀이 피드백을 보려면 먼저 로그인해주세요.
        </p>
        <Link
          href="/login"
          className="mt-5 inline-flex rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
        >
          로그인하러 가기
        </Link>
      </SectionCard>
    );
  }

  return (
    <SectionCard className="p-6">
      <h2 className="text-lg font-bold text-slate-950">
        피드백을 불러오지 못했습니다
      </h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        {getRecordErrorMessage(error)}
      </p>
    </SectionCard>
  );
}

function CommentList({ comments }: { comments: FeedbackCommentDto[] }) {
  if (comments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
        아직 피드백 댓글이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <article
          key={comment.id}
          className="rounded-xl border border-slate-200 bg-white p-4"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
              {comment.author.avatarLabel}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-slate-950">
                  {comment.author.name}
                </h3>
                <Badge className="bg-slate-100 text-slate-600">
                  {roleLabels[comment.author.role]}
                </Badge>
              </div>
              <p className="text-xs font-medium text-slate-400">
                {formatSubmittedAt(comment.submittedAt)}
              </p>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {comment.content}
          </p>
        </article>
      ))}
    </div>
  );
}

function FeedbackDetail({ detail }: { detail: RecordDetailResponse }) {
  const { record, comments } = detail;

  return (
    <div className="mt-6 space-y-6">
      <SectionCard className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold tracking-tight text-slate-950">
                {record.problem.title}
              </h2>
              <Badge className={difficultyClasses[record.problem.difficulty]}>
                {difficultyLabels[record.problem.difficulty]}
              </Badge>
              {record.problem.tags.map((tag) => (
                <Badge key={tag} className="bg-blue-50 text-blue-700">
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="mt-2 text-sm font-medium text-slate-500">
              {record.author.name} · {record.language} ·{" "}
              {formatSubmittedAt(record.submittedAt)}
            </p>
            {record.reviewNote ? (
              <p className="mt-3 max-w-3xl rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                {record.reviewNote}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge className="bg-slate-100 text-slate-700">
              실행 시간 {record.runtime || "-"}
            </Badge>
            <Badge className="bg-slate-100 text-slate-700">
              메모리 {record.memory || "-"}
            </Badge>
          </div>
        </div>

        <pre
          aria-label="풀이 코드"
          className="mt-5 max-h-[560px] overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-800"
        >
          <code>{record.code}</code>
        </pre>
      </SectionCard>

      <SectionCard className="p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950">피드백</h2>
            <p className="mt-1 text-sm text-slate-500">
              이 풀이에 저장된 리뷰 댓글입니다.
            </p>
          </div>
          <Badge className="bg-teal-50 text-teal-700">
            댓글 {comments.length}개
          </Badge>
        </div>

        <div className="mt-5">
          <CommentList comments={comments} />
        </div>
      </SectionCard>

      <SectionCard className="p-5">
        <h2 className="text-lg font-bold text-slate-950">피드백 추가</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          짧은 리뷰, 질문, 개선 아이디어를 남겨주세요.
        </p>
        <FeedbackForm recordId={record.id} />
      </SectionCard>
    </div>
  );
}

export default async function RecordFeedbackPage({
  params,
}: RecordFeedbackPageProps) {
  const { id } = await params;
  const { data, error } = await loadPageDetail(id);

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
              코드 피드백
            </p>
            <h1 className="mt-3 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              피드백 스레드
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              제출한 풀이와 저장된 피드백 댓글을 함께 확인하세요.
            </p>
          </div>
        </div>
      </section>

      {error ? (
        <div className="mt-6">
          <ErrorState error={error} />
        </div>
      ) : null}
      {data ? <FeedbackDetail detail={data} /> : null}
    </main>
  );
}
