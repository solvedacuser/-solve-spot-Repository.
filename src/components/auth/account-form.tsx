"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/app/auth/actions";
import { FormNotice, FieldError } from "@/components/auth/auth-shell";
import { initialAuthActionState } from "@/lib/auth/forms";

export function AccountForm({
  email,
  displayName,
  leetcodeUsername,
  signup_at,
  ranking,
  reputation,
}: {
  email: string;
  displayName: string;
  leetcodeUsername: string;
  signup_at: string;
  ranking: number;
  reputation: number;
}) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialAuthActionState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <label className="flex flex-col">
        <div className="flex flex-row">
          <span className="inline-block my-auto md:w-[30%] text-sm font-medium text-slate-700">
            이름
          </span>
          <input
            name="displayName"
            defaultValue={displayName}
            autoComplete="name"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          />
        </div>
        <div className="ml-auto">
          <FieldError message={state.fieldErrors.displayName} />
        </div>
      </label>

      <label className="flex flex-col">
        <div className="flex flex-row">
          <span className="inline-block my-auto md:w-[30%] text-xs lg:text-sm font-medium text-slate-700">
            Leetcode
            <br className="hidden md:block" /> Username
          </span>
          <input
            name="boj_handle"
            defaultValue={leetcodeUsername}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            placeholder="LeetCode Username"
          />
        </div>
        <div className="ml-auto">
          <FieldError message={state.fieldErrors.bojHandle ?? state.fieldErrors.leetcodeUsername} />
        </div>
      </label>

      <label className="flex flex-row">
        <span className="inline-block my-auto md:w-[30%] block text-sm font-medium text-slate-700">
          이메일
        </span>
        <input
          value={email}
          readOnly
          disabled
          className="inline-block w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500"
        />
      </label>

      <label className="flex flex-row">
        <span className="inline-block my-auto md:w-[30%] block text-sm font-medium text-slate-700">
          가입일
        </span>
        <input
          value={signup_at}
          readOnly
          disabled
          className="inline-block w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500"
        />
      </label>

      <label className="flex flex-row">
        <span className="inline-block my-auto md:w-[30%] block text-sm font-medium text-slate-700">
          ranking
        </span>
        <input
          value={ranking}
          readOnly
          disabled
          className="inline-block w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500"
        />
      </label>
      <label className="flex flex-row">
        <span className="inline-block my-auto md:w-[30%] block text-sm font-medium text-slate-700">
          reputation
        </span>
        <input
          value={reputation}
          readOnly
          disabled
          className="inline-block w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500"
        />
      </label>
      <div className="flex">
        <button
          type="submit"
          className="ml-auto rounded-full bg-teal-700 px-5 py-3 text-xs font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
          disabled={isPending}
        >
          {isPending ? "저장 중..." : "프로필 저장"}
        </button>
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
    </form>
  );
}
