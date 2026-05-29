"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

type FeedbackFormProps = {
  recordId: string;
};

export function FeedbackForm({ recordId }: FeedbackFormProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsPending(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/record/${recordId}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      await response.json();

      if (!response.ok) {
        setErrorMessage("피드백을 저장하지 못했습니다. 입력값을 확인해주세요.");
        return;
      }

      setContent("");
      router.refresh();
    } catch {
      setErrorMessage("피드백을 저장하지 못했습니다. 연결 상태를 확인한 뒤 다시 시도해주세요.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="mt-4" onSubmit={handleSubmit}>
      <textarea
        aria-label="피드백 내용"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        className="min-h-36 w-full resize-y rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
        placeholder="풀이 흐름이 명확합니다. 엣지 케이스에 대한 설명을 조금 더 남겨보세요."
        required
      />

      {errorMessage ? (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={isPending || !content.trim()}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isPending ? "저장 중..." : "피드백 저장"}
        </button>
      </div>
    </form>
  );
}
