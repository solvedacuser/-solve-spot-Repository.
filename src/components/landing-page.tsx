import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  Code2,
  PlayCircle,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LandingHeroShowcase } from "@/components/landing-hero-showcase";

type FeatureCard = {
  title: string;
  description: string;
  details: string[];
  icon: LucideIcon;
  iconClassName: string;
};

type WorkflowStep = {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
};

type Metric = {
  value: string;
  label: string;
  description: string;
  className: string;
};

const featureCards: FeatureCard[] = [
  {
    title: "팀 스터디",
    description: "팀 목표와 난이도에 맞는 문제를 함께 풀고 진행 상황을 공유합니다.",
    details: ["팀별 문제 큐", "풀이 현황 추적", "스터디 피드백"],
    icon: UsersRound,
    iconClassName: "bg-blue-100 text-blue-600",
  },
  {
    title: "학습 관리",
    description: "풀이 기록과 제출 흐름을 모아 꾸준한 학습 루틴을 만듭니다.",
    details: ["최근 제출 확인", "학습 캘린더", "태그별 약점 파악"],
    icon: CalendarCheck,
    iconClassName: "bg-orange-100 text-orange-600",
  },
  {
    title: "AI 학습 헬퍼",
    description: "코드 리뷰 관점의 힌트와 다음 복습 방향을 빠르게 확인합니다.",
    details: ["코드 피드백", "복습 문제 추천", "접근법 점검"],
    icon: Sparkles,
    iconClassName: "bg-emerald-100 text-emerald-600",
  },
];

const workflowSteps: WorkflowStep[] = [
  {
    step: "01",
    title: "LeetCode 사용자 연결",
    description: "공개 username 기반으로 프로필, 언어, 태그, 최근 Accepted 흐름을 읽습니다.",
    icon: Code2,
    iconClassName: "bg-blue-100 text-blue-600",
  },
  {
    step: "02",
    title: "팀 목표에 맞춘 추천",
    description: "난이도와 태그 후보를 조합해 지금 풀기 좋은 문제를 고릅니다.",
    icon: Target,
    iconClassName: "bg-orange-100 text-orange-600",
  },
  {
    step: "03",
    title: "풀이 기록과 피드백",
    description: "최근 제출 기반 검증과 팀 코멘트로 다음 학습 액션을 남깁니다.",
    icon: UsersRound,
    iconClassName: "bg-emerald-100 text-emerald-600",
  },
];

const metrics: Metric[] = [
  {
    value: "LeetCode",
    label: "문제 추천 기반",
    description: "titleSlug와 태그 중심으로 문제 흐름을 관리합니다.",
    className: "text-blue-300",
  },
  {
    value: "Recent AC",
    label: "최근 제출 기반 검증",
    description: "공개 username 모드의 한계를 명확히 표시합니다.",
    className: "text-emerald-300",
  },
  {
    value: "Team Flow",
    label: "팀 학습 기록",
    description: "개인 풀이가 팀의 다음 액션으로 이어지게 만듭니다.",
    className: "text-orange-300",
  },
];

function FeatureCard({ card }: { card: FeatureCard }) {
  const Icon = card.icon;

  return (
    <article className="rounded-lg border border-white/70 bg-white/85 p-6 shadow-panel backdrop-blur transition hover:-translate-y-1 hover:shadow-xl">
      <Icon className={`h-11 w-11 rounded-lg p-2 ${card.iconClassName}`} />
      <h3 className="mt-5 text-xl font-semibold text-slate-950">
        {card.title}
      </h3>
      <p className="mt-2 min-h-14 text-sm leading-6 text-slate-600">
        {card.description}
      </p>
      <ul className="mt-5 space-y-2 text-sm text-slate-700">
        {card.details.map((detail) => (
          <li key={detail} className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{detail}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function WorkflowStep({ item }: { item: WorkflowStep }) {
  const Icon = item.icon;

  return (
    <li className="rounded-lg border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur">
      <div className="flex items-start gap-4">
        <Icon className={`h-11 w-11 shrink-0 rounded-lg p-2 ${item.iconClassName}`} />
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-400">
            STEP {item.step}
          </p>
          <h3 className="mt-1 font-semibold text-slate-950">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {item.description}
          </p>
        </div>
      </div>
    </li>
  );
}

export function LandingPage() {
  return (
    <main className="overflow-hidden">
      <section className="mx-auto flex min-h-[calc(100vh-112px)] max-w-5xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col items-center">
          <p className="mb-5 inline-flex items-center rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
            LeetCode 기반 팀 알고리즘 학습 플랫폼
          </p>
          <h1 className="text-5xl font-bold leading-tight text-slate-950 sm:text-6xl lg:text-7xl">
            팀과 함께 성장하는
            <br />
            <span className="text-blue-600">코딩 학습 코파일럿</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            문제 추천부터 풀이 기록, 코드 피드백까지 한곳에서 관리하세요.
            Solve Spot은 팀의 학습 흐름을 더 선명하게 이어줍니다.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-7 py-3 text-sm font-semibold text-white shadow-panel transition hover:bg-slate-800"
            >
              지금 시작하기
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#services"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/70 bg-white/85 px-7 py-3 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:bg-white"
            >
              <PlayCircle className="h-5 w-5" />
              서비스 살펴보기
            </Link>
          </div>

          <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
            {["문제 추천", "최근 제출 검증", "팀 피드백"].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-white/70 bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">
            풀이 화면부터 팀 학습 장면까지
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            코드 목업과 실제 학습 분위기를 함께 넘겨보며 Solve Spot의 사용 흐름을 확인하세요.
          </p>
        </div>
        <LandingHeroShowcase />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">
            문제 풀이가 팀의 성장 기록이 되도록
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            개인의 Accepted 하나가 추천, 복습, 팀 피드백으로 자연스럽게 이어집니다.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {featureCards.map((card) => (
            <FeatureCard key={card.title} card={card} />
          ))}
        </div>
      </section>

      <section
        id="services"
        className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8"
      >
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-blue-600">
            HOW IT WORKS
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-950 sm:text-4xl">
            Solve Spot은 풀이 전후의 흐름을 연결합니다
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            문제와 풀이 결과가 이어지는 경험처럼, Solve Spot은 코딩 학습의 입력과 결과를
            한 화면에서 이해할 수 있게 정리합니다.
          </p>
        </div>

        <ul className="space-y-4">
          {workflowSteps.map((item) => (
            <WorkflowStep key={item.step} item={item} />
          ))}
        </ul>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[28px] bg-slate-950 px-6 py-14 text-center shadow-2xl shadow-slate-950/20 sm:px-10">
          <BarChart3 className="mx-auto h-10 w-10 text-blue-300" />
          <h2 className="mt-5 text-3xl font-bold text-white">
            검증 가능한 학습 신호만 모읍니다
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-300">
            공개 username 모드의 한계를 숨기지 않고, 최근 제출과 문제 메타데이터를
            기반으로 팀이 바로 움직일 수 있는 정보를 제공합니다.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="text-left">
                <p className={`text-3xl font-bold ${metric.className}`}>
                  {metric.value}
                </p>
                <p className="mt-3 text-sm font-semibold text-white">
                  {metric.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/login"
            className="mt-12 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            팀 학습 시작하기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
