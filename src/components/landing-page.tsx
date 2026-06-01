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

type FeatureCard = {
  title: string;
  description: string;
  details: string[];
  icon: LucideIcon;
  iconClassName: string;
};

type ServiceItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName: string;
};

const workspaceImage =
  "https://images.unsplash.com/photo-1535957998253-26ae1ef29506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNoJTIwd29ya3NwYWNlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3OTIwMTU1M3ww&ixlib=rb-4.1.0&q=80&w=1080";

const collaborationImage =
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG1lZXRpbmd8ZW58MXx8fHwxNzc5MTE5OTMxfDA&ixlib=rb-4.1.0&q=80&w=1080";

const featureCards: FeatureCard[] = [
  {
    title: "팀 스터디",
    description: "명확한 목표를 가진 팀원들과 함께 빠르게 성장해요.",
    details: ["문제 추천", "스터디 현황 추적", "소스코드 피드백"],
    icon: UsersRound,
    iconClassName: "bg-blue-100 text-blue-600",
  },
  {
    title: "학습 관리",
    description: "학습 상황을 자동 기록하고, 꾸준한 학습 경험을 만들어요.",
    details: ["학습 상황 기록", "시각화된 대시보드", "학습 습관 형성"],
    icon: Target,
    iconClassName: "bg-orange-100 text-orange-600",
  },
  {
    title: "AI 학습 헬퍼",
    description: "AI 분석을 통해 문제 접근에 대한 새로운 인사이트를 얻어요.",
    details: ["AI 소스코드 분석", "AI 피드백", "복습 문제 추천"],
    icon: Sparkles,
    iconClassName: "bg-emerald-100 text-emerald-600",
  },
];

const serviceItems: ServiceItem[] = [
  {
    title: "팀 스터디",
    description:
      "스터디 팀 생성과 문제 추천 설정으로 손쉽게 팀을 구성하고 진행 상황을 확인합니다.",
    icon: UsersRound,
    iconClassName: "bg-blue-100 text-blue-600",
  },
  {
    title: "학습 관리",
    description:
      "학습 기록을 시각화해 팀과 개인의 풀이 흐름을 꾸준히 관리합니다.",
    icon: CalendarCheck,
    iconClassName: "bg-orange-100 text-orange-600",
  },
  {
    title: "AI를 통한 학습",
    description:
      "AI가 소스코드를 분석해 피드백을 제공하고 다음 복습 방향을 제안합니다.",
    icon: Code2,
    iconClassName: "bg-yellow-100 text-yellow-700",
  },
];

const stats = [
  { value: "3,500+", label: "제공하는 문제 수", className: "text-blue-300" },
  { value: "1,000+", label: "이용자 수", className: "text-emerald-300" },
  { value: "250,000+", label: "해결한 문제 수", className: "text-orange-300" },
  { value: "300+", label: "활동 중인 팀", className: "text-yellow-300" },
];

function FeatureCard({ card }: { card: FeatureCard }) {
  const Icon = card.icon;

  return (
    <article className="rounded-lg border border-white/70 bg-white/80 p-6 shadow-panel backdrop-blur transition hover:-translate-y-1 hover:shadow-xl">
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

function ServiceItem({ item }: { item: ServiceItem }) {
  const Icon = item.icon;

  return (
    <li className="rounded-lg border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur transition hover:shadow-lg">
      <div className="flex gap-4">
        <Icon className={`h-11 w-11 shrink-0 rounded-lg p-2 ${item.iconClassName}`} />
        <div>
          <h3 className="font-semibold text-slate-950">{item.title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
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
      <section className="mx-auto grid min-h-[calc(100vh-112px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:px-8 lg:py-20">
        <div>
          <p className="mb-5 inline-flex items-center rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur">
            LeetCode 기반 팀 학습 플랫폼
          </p>
          <h1 className="text-5xl font-bold leading-tight text-slate-950 sm:text-6xl lg:text-7xl">
            다같이 성장하는
            <br />
            <span className="text-blue-600">Solve Spot</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
            협업과 기록을 한곳에 모아 알고리즘 학습을 더 꾸준하게 이어가요.
            팀의 목표를 정하고, 문제 추천부터 피드백까지 함께 관리하세요.
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
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/70 bg-white/80 px-7 py-3 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:bg-white"
            >
              <PlayCircle className="h-5 w-5" />
              서비스 살펴보기
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 rounded-[28px] bg-white/35 blur-xl" />
          <div
            role="img"
            aria-label="Solve Spot workspace preview"
            className="relative aspect-[4/3] w-full rounded-[28px] bg-cover bg-center shadow-2xl shadow-blue-900/20"
            style={{ backgroundImage: `url(${workspaceImage})` }}
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">
            어렵기만 하던 알고리즘, 다함께 돌파해요
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            모든 팀원이 하나의 플랫폼에서 협력하고 성장할 수 있어요.
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
        className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8"
      >
        <div
          role="img"
          aria-label="Team collaboration meeting"
          className="aspect-[4/3] w-full rounded-lg bg-cover bg-center shadow-xl"
          style={{ backgroundImage: `url(${collaborationImage})` }}
        />

        <div>
          <h2 className="text-3xl font-semibold text-slate-950">
            우리가 제공하는 서비스
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            팀 구성, 기록, 분석 흐름을 한 화면에서 이어가도록 설계했습니다.
          </p>
          <ul className="mt-8 space-y-4">
            {serviceItems.map((item) => (
              <ServiceItem key={item.title} item={item} />
            ))}
          </ul>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[28px] bg-slate-950 px-6 py-14 text-center shadow-2xl shadow-slate-950/20 sm:px-10">
          <BarChart3 className="mx-auto h-10 w-10 text-blue-300" />
          <h2 className="mt-5 text-3xl font-bold text-white">
            수치가 입증하는 성과
          </h2>
          <p className="mt-3 text-slate-300">Solve Spot이 만드는 학습 흐름</p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className={`text-4xl font-bold ${stat.className}`}>
                  {stat.value}
                </p>
                <p className="mt-3 text-sm text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>

          <Link
            href="/login"
            className="mt-12 inline-flex items-center justify-center gap-2 rounded-lg bg-white px-8 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            지금 시작하기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
