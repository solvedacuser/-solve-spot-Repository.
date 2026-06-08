"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutAction } from "@/app/auth/actions";

type SiteNavProps = {
  isAuthenticated: boolean;
  userEmail?: string;
  displayName?: string | null;
};

function navLinkClass(isActive: boolean, isHomeTop: boolean) {
  return [
    "rounded-full px-4 py-2 text-sm font-medium transition",
    isActive
      ? isHomeTop
        ? "text-blue-700"
        : "bg-slate-950 text-white shadow-sm"
      : isHomeTop
        ? "text-slate-600 hover:bg-white/70 hover:text-slate-950"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
  ].join(" ");
}

export function SiteNav({ isAuthenticated, userEmail, displayName }: SiteNavProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const identityLabel = displayName || userEmail || "account";
  const isRecordActive = pathname.startsWith("/record");
  const isLanding = pathname === "/";
  const isHomeTop = isLanding && !isScrolled;

  useEffect(() => {
    if (!isLanding) {
      setIsScrolled(false);
      return;
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLanding]);

  return (
    <header
      className={[
        "top-0 z-40 w-full px-4 sm:px-6 lg:px-8",
        isLanding ? "fixed py-0" : "sticky pt-4",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto max-w-7xl transition-all duration-300",
          isLanding
            ? isScrolled
              ? "mt-3 rounded-lg border border-slate-200/70 bg-white/82 px-4 py-3 shadow-sm backdrop-blur-xl"
              : "border border-transparent bg-transparent px-0 py-5 shadow-none"
            : "rounded-lg border border-white/60 bg-white/85 px-4 py-3 shadow-panel backdrop-blur",
        ].join(" ")}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className={[
                "rounded-full px-4 py-2 text-sm font-semibold tracking-[0.2em] transition",
                isHomeTop
                  ? "bg-slate-950 text-white"
                  : "bg-slate-950 text-white shadow-sm",
              ].join(" ")}
            >
              SLOVE SPOT
            </Link>
            <nav className="hidden flex-wrap items-center gap-2 md:flex">
              <Link href="/" className={navLinkClass(pathname === "/", isHomeTop)}>
                Home
              </Link>
              <Link href="/record" className={navLinkClass(isRecordActive, isHomeTop)}>
                Records
              </Link>
              <Link href="/api-check" className={navLinkClass(pathname === "/api-check", isHomeTop)}>
                API Check
              </Link>
              <Link href="/leetcode-api" className={navLinkClass(pathname === "/leetcode-api", isHomeTop)}>
                LeetCode API
              </Link>
              <Link href="/teams" className={navLinkClass(pathname === "/teams", isHomeTop)}>
                Teams
              </Link>
              <Link href="/helper" className={navLinkClass(pathname === "/helper")}>
                Helper
              </Link>
            </nav>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  {identityLabel}
                </span>
                <Link href="/account" className={navLinkClass(pathname === "/account", isHomeTop)}>
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
                <Link href="/login" className={navLinkClass(pathname === "/login", isHomeTop)}>
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={pathname === "/signup"
                    ? "rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm"
                    : isHomeTop
                      ? "rounded-full border border-blue-200 bg-white/72 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-white"
                      : "rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"}
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
