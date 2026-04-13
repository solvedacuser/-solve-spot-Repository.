import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthPageShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";
import { getCallbackErrorMessage } from "@/lib/auth/forms";
import { createClient } from "@/utils/supabase/server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  const params = searchParams ? await searchParams : {};
  const rawError = typeof params.error === "string" ? params.error : null;

  return (
    <AuthPageShell
      eyebrow="Auth / Login"
      title="세션을 복구하고 다시 시작하기"
      description="이메일 인증이 끝난 계정은 바로 로그인할 수 있습니다. 인증 링크는 `/auth/callback`에서 세션으로 교환됩니다."
      footer={
        <p>
          아직 계정이 없으면{" "}
          <Link href="/signup" className="font-semibold text-teal-700 underline decoration-teal-200 underline-offset-4">
            회원가입
          </Link>
          으로 이동하세요.
        </p>
      }
    >
      <LoginForm notice={getCallbackErrorMessage(rawError)} />
    </AuthPageShell>
  );
}
