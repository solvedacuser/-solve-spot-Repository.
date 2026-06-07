import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, Code2, Search, ShieldCheck, Target } from "lucide-react";
import heroImage from "@/images/landing-back.png";

const featureCards = [
  {
    title: "공개 프로필 분석",
    description: "LeetCode username만으로 풀이 수, 언어 통계, 태그별 강점을 한 화면에서 확인합니다.",
    icon: Search,
    className: "bg-blue-50 text-blue-700",
  },
  {
    title: "최근 AC 기반 추천",
    description: "최근 Accepted 제출을 확인해 이미 푼 문제를 최대한 제외하고 다음 문제 후보를 고릅니다.",
    icon: Target,
    className: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "풀이 검증",
    description: "titleSlug가 최근 Accepted 제출에 있으면 SOLVED, 없으면 UNKNOWN으로 안전하게 표시합니다.",
    icon: ShieldCheck,
    className: "bg-violet-50 text-violet-700",
  },
];

const workflowSteps = [
  "LeetCode username을 입력합니다.",
  "공개 프로필, 언어, 태그, 캘린더 데이터를 가져옵니다.",
  "최근 Accepted 제출을 기준으로 추천과 검증을 제공합니다.",
];

export function LandingPage() {
  return (
    <main className="overflow-hidden text-slate-950">
      <section className="relative min-h-[960px] overflow-hidden px-4 pt-28 text-center sm:min-h-[1040px] sm:px-6 lg:min-h-[1180px] lg:px-8">
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
          <h1 className="max-w-4xl text-5xl font-bold leading-[1.15] tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
            LeetCode 풀이를 분석하고
            <br className="hidden sm:block" />
            다음 문제를 추천받으세요
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
            공개 username만 입력하면 풀이 기록, 언어 통계, 태그별 강점,
            최근 Accepted 기반 추천까지 바로 확인할 수 있어요.
          </p>

          <form
            action="/leetcode-api"
            className="mt-9 flex w-full max-w-2xl flex-col gap-3 rounded-lg border border-slate-200 bg-white/88 p-2 shadow-[0_20px_70px_rgba(37,99,235,0.12)] backdrop-blur sm:flex-row"
          >
            <label className="sr-only" htmlFor="leetcode-username">
              LeetCode username
            </label>
            <input
              id="leetcode-username"
              name="username"
              placeholder="LeetCode username"
              className="min-h-12 flex-1 rounded-md border border-transparent bg-transparent px-4 text-base text-slate-950 outline-none placeholder:text-slate-400 focus:border-blue-200 focus:bg-white"
            />
            <button
              type="submit"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-blue-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              분석 시작
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-4 text-sm font-medium text-slate-500">
            로그인 없이 공개 프로필로 먼저 확인할 수 있습니다.
          </p>
        </div>

        <div className="pointer-events-none absolute inset-x-1/2 bottom-0 z-0 w-screen max-w-none -translate-x-1/2 [mask-image:linear-gradient(to_bottom,transparent_0%,black_18%,black_100%)]">
          <Image
            src={heroImage}
            alt="코딩 학습과 LeetCode 분석을 표현한 3D 오브젝트"
            priority
            className="h-auto w-full select-none"
            sizes="100vw"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
            풀이 기록이 다음 액션으로 이어지도록
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
            Solve Spot은 LeetCode 공개 데이터를 서버에서 안전하게 가져오고,
            추천과 검증 결과를 과장 없이 보여주는 학습 도구입니다.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {featureCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)]"
              >
                <Icon className={`h-11 w-11 rounded-lg p-2 ${card.className}`} />
                <h3 className="mt-5 text-xl font-semibold text-slate-950">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section id="services" className="bg-slate-950 px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Code2 className="h-11 w-11 text-blue-300" />
            <h2 className="mt-5 text-3xl font-bold tracking-normal sm:text-4xl">
              LeetCode 통합은 서버 안에서만 처리합니다
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
              클라이언트는 로컬 API Route만 호출하고, LeetCode GraphQL 응답은 Zod로 검증한 뒤
              앱에 필요한 데이터만 돌려줍니다.
            </p>
            <Link
              href="/leetcode-api"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              API 워크벤치 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <ol className="grid gap-4">
            {workflowSteps.map((step, index) => (
              <li
                key={step}
                className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/[0.06] p-5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-400 text-sm font-bold text-slate-950">
                  {index + 1}
                </span>
                <span className="pt-1 text-base font-medium leading-7 text-slate-100">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <BarChart3 className="h-11 w-11 text-blue-600" />
            <h2 className="mt-5 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
              정확히 모르는 것은 UNKNOWN으로 남깁니다
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              공개 username 모드에서는 완전한 solved 목록을 보장할 수 없습니다.
              그래서 추천은 최근 Accepted 제출만 제외하고, 검증도 확인 가능한 범위 안에서만 판단합니다.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
            <ul className="space-y-4 text-sm leading-7 text-slate-700">
              {[
                "최근 Accepted에 있으면 SOLVED로 표시",
                "최근 Accepted에 없으면 UNSOLVED가 아니라 UNKNOWN으로 표시",
                "LeetCode 문제 식별자는 titleSlug를 우선 사용",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
