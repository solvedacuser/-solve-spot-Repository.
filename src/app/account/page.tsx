import { redirect } from "next/navigation";
import { AccountForm } from "@/components/auth/account-form";
import { createClient } from "@/utils/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, boj_handle")
    .eq("id", user.id)
    .maybeSingle();

  const displayName =
    profile?.display_name ?? (typeof user.user_metadata.display_name === "string" ? user.user_metadata.display_name : "");
  const bojHandle =
    profile?.boj_handle ?? (typeof user.user_metadata.boj_handle === "string" ? user.user_metadata.boj_handle : "");

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[36px] border border-white/60 bg-white/85 shadow-panel backdrop-blur">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-slate-950 p-8 text-white">
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-teal-300">Account</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">프로필 관리</h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">
              로그인 세션은 `auth.users`에서 관리하고, 화면에 노출할 이름과 BOJ handle은 `public.profiles`에서 관리합니다.
            </p>
          </div>

          <div className="p-6 lg:p-8">
            <div className="mb-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-slate-500">Profile</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">내 정보 수정</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                solved.ac 기능은 공개 상태로 유지하고, 이 화면에서만 계정 프로필을 관리합니다.
              </p>
            </div>

            <AccountForm email={user.email ?? ""} displayName={displayName} bojHandle={bojHandle} />
          </div>
        </div>
      </section>
    </main>
  );
}
