export function AuthPageShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid w-full gap-6 overflow-hidden rounded-[36px] border border-white/60 bg-white/85 p-6 shadow-panel backdrop-blur lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
        <div className="rounded-[28px] bg-slate-950 p-8 text-white">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-teal-300">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">{description}</p>
          <div className="mt-8 space-y-3 text-sm text-slate-300">
            <p>Supabase Auth가 인증을 담당하고, 앱 프로필 데이터는 `public.profiles`에서 관리합니다.</p>
            <p>solved.ac 기능은 그대로 공개 상태로 유지하고, 계정 설정만 로그인 후 접근합니다.</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 lg:p-8">
          {children}
          {footer ? <div className="mt-6 border-t border-slate-200 pt-5 text-sm text-slate-600">{footer}</div> : null}
        </div>
      </section>
    </main>
  );
}

export function FormNotice({
  message,
  tone = "neutral",
}: {
  message?: string;
  tone?: "neutral" | "success" | "error";
}) {
  if (!message) {
    return null;
  }

  const styles = {
    neutral: "border-slate-200 bg-slate-50 text-slate-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    error: "border-rose-200 bg-rose-50 text-rose-700",
  }[tone];

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${styles}`}>{message}</div>;
}

export function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-rose-600">{message}</p>;
}
