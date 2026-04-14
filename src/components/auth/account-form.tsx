"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/app/auth/actions";
import { FormNotice, FieldError } from "@/components/auth/auth-shell";
import { initialAuthActionState } from "@/lib/auth/forms";

export function AccountForm({
  email,
  displayName,
  bojHandle,
}: {
  email: string;
  displayName: string;
  bojHandle: string;
}) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, initialAuthActionState);

  return (
    <form action={formAction} className="space-y-5">
      <FormNotice
        message={state.message}
        tone={state.status === "error" ? "error" : state.status === "success" ? "success" : "neutral"}
      />

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">이메일</span>
        <input
          value={email}
          readOnly
          disabled
          className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500"
        />
        <p className="mt-2 text-sm text-slate-500">이메일은 Supabase Auth에서 관리합니다.</p>
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">이름</span>
        <input
          name="displayName"
          defaultValue={displayName}
          autoComplete="name"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
        />
        <FieldError message={state.fieldErrors.displayName} />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">BOJ handle</span>
        <input
          name="bojHandle"
          defaultValue={bojHandle}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          placeholder="선택 입력"
        />
        <FieldError message={state.fieldErrors.bojHandle} />
      </label>

      <button
        type="submit"
        className="rounded-full bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
        disabled={isPending}
      >
        {isPending ? "저장 중..." : "프로필 저장"}
      </button>
    </form>
  );
}
