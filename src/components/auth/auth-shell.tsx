export function AuthPageShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl items-center px-3 py-10 sm:px-4 lg:px-6">
      <section className="w-full overflow-hidden rounded-[36px] border border-white/60 bg-white/85 p-6 shadow-panel backdrop-blur lg:p-8">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 lg:p-8">
          {children}
          {footer ? (
            <div className="mt-6 border-t border-slate-200 pt-5 text-sm text-slate-600">
              {footer}
            </div>
          ) : null}
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

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${styles}`}>
      {message}
    </div>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-rose-600">{message}</p>;
}
