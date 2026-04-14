"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/auth/actions";
import { FormNotice, FieldError } from "@/components/auth/auth-shell";
import { initialAuthActionState } from "@/lib/auth/forms";

export function LoginForm({ notice }: { notice?: string }) {
  const [state, formAction, isPending] = useActionState(loginAction, initialAuthActionState);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500">Login</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">이메일로 로그인</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          인증 메일을 이미 확인했다면 바로 로그인할 수 있습니다.
        </p>
      </div>

      <FormNotice
        message={state.message || notice}
        tone={state.status === "error" ? "error" : state.status === "success" ? "success" : "neutral"}
      />

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">이메일</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          placeholder="you@example.com"
        />
        <FieldError message={state.fieldErrors.email} />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">비밀번호</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          placeholder="8자 이상 입력"
        />
        <FieldError message={state.fieldErrors.password} />
      </label>

      <button
        type="submit"
        className="w-full rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
        disabled={isPending}
      >
        {isPending ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
