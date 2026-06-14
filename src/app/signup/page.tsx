import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthPageShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";
import { createClient } from "@/utils/supabase/server";

export default async function SignupPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <AuthPageShell
      footer={
        <p>
          이미 계정이 있으면{" "}
          <Link
            href="/login"
            className="font-semibold text-orange-700 underline decoration-orange-200 underline-offset-4"
          >
            로그인
          </Link>
          으로 이동하세요.
        </p>
      }
    >
      <SignupForm />
    </AuthPageShell>
  );
}
