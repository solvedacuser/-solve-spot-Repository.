"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/auth/actions";

type SiteNavProps = {
  isAuthenticated: boolean;
  userEmail?: string;
  displayName?: string | null;
};

function navLinkClass(isActive: boolean) {
  return [
    "rounded-full px-4 py-2 text-sm font-medium transition",
    isActive
      ? "bg-slate-950 text-white shadow-sm"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
  ].join(" ");
}

export function SiteNav({ isAuthenticated, userEmail, displayName }: SiteNavProps) {
  const pathname = usePathname();
  const identityLabel = displayName || userEmail || "account";
  const isRecordActive = pathname.startsWith("/record");

  return (
    <header className="sticky top-0 z-40 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[28px] border border-white/60 bg-white/85 px-4 py-3 shadow-panel backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold tracking-[0.2em] text-white">
              SLOVE SPOT
            </Link>
            <nav className="flex flex-wrap items-center gap-2">
              <Link href="/" className={navLinkClass(pathname === "/")}>
                Home
              </Link>
              <Link href="/record" className={navLinkClass(isRecordActive)}>
                Records
              </Link>
              <Link href="/api-check" className={navLinkClass(pathname === "/api-check")}>
                API Check
              </Link>
              <Link href="/leetcode-api" className={navLinkClass(pathname === "/leetcode-api")}>
                LeetCode API
              </Link>
              <Link href="/teams" className={navLinkClass(pathname === "/teams")}>
                Teams
              </Link>
              <Link href="/analysis" className={navLinkClass(pathname === "/analysis")}>
                Ai-Analysis
              </Link>
            </nav>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  {identityLabel}
                </span>
                <Link href="/account" className={navLinkClass(pathname === "/account")}>
                  Account
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                  >
                    Logout
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className={navLinkClass(pathname === "/login")}>
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={pathname === "/signup"
                    ? "rounded-full bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm"
                    : "rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 transition hover:bg-orange-100"}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
