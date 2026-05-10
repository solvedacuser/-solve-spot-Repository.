import { LeetCodeWorkbench } from "@/components/leetcode-workbench";
import { createClient } from "@/utils/supabase/server";

export default async function LeetCodeApiPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle()
    : { data: null };

  return (
    <main className="space-y-8 pb-10">
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-white/60 bg-white/85 p-6 shadow-panel backdrop-blur">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500">LeetCode API</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            LeetCode integration workbench
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            This page verifies the local `/api/leetcode/*` route handlers for public username lookup, bio lookup,
            profile extension stats, problem recommendation, and recent accepted solved checks.
          </p>

          <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
              {user ? "Authenticated session active" : "Public access enabled"}
            </span>
            {user?.email ? (
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">{user.email}</span>
            ) : null}
            {profile?.display_name ? (
              <span className="rounded-full bg-cyan-50 px-3 py-1 font-medium text-cyan-700">
                {profile.display_name}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      <LeetCodeWorkbench />
    </main>
  );
}
