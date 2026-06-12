"use client";

import { useActionState } from "react";
import { signupAction } from "@/app/auth/actions";
import { FormNotice, FieldError } from "@/components/auth/auth-shell";
import { initialAuthActionState } from "@/lib/auth/forms";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialAuthActionState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500">
          Signup
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
          이메일 회원가입
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          가입 후 확인 메일을 보내고, 메일 링크에서 세션을 생성합니다.
        </p>
      </div>

      <FormNotice
        message={state.message}
        tone={
          state.status === "error"
            ? "error"
            : state.status === "success"
              ? "success"
              : "neutral"
        }
      />

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          이름
        </span>
        <input
          name="displayName"
          autoComplete="name"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
          placeholder="활동명"
        />
        <FieldError message={state.fieldErrors.displayName} />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          이메일
        </span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
          placeholder="you@example.com"
        />
        <FieldError message={state.fieldErrors.email} />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          비밀번호
        </span>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
          placeholder="8자 이상 입력"
        />
        <FieldError message={state.fieldErrors.password} />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-slate-700">
          Leetcode username
        </span>
        <input
          name="bojHandle"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
          placeholder="필수 입력"
        />
        <FieldError message={state.fieldErrors.bojHandle} />
      </label>

      <button
        type="submit"
        className="w-full rounded-full bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60"
        disabled={isPending}
      >
        {isPending ? "가입 요청 중..." : "회원가입"}
      </button>
    </form>
  );
}
