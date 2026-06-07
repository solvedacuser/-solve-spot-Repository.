import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Crown,
  Medal,
  Search,
  ShieldCheck,
  Target,
  Trophy,
  UsersRound,
} from "lucide-react";
import type { LandingTopTeam } from "@/lib/landing/top-teams";
import heroImage from "@/images/landing-back.png";
import Chip from "@mui/material/Chip";
import img_HRProcess from "@/images/recruitmentProcess.png";
import img_competency from "@/images/competency.png";
import img_codeReview from "@/images/techInterview.jpg";
import img_meeting from "@/images/meeting.jpg";

const featureCards = [
  {
    title: "공개 프로필 분석",
    description:
      "LeetCode username만으로 풀이 수, 언어 통계, 태그별 강점을 한 화면에서 확인합니다.",
    icon: Search,
    className: "bg-blue-50 text-blue-700",
  },
  {
    title: "최근 AC 기반 추천",
    description:
      "최근 Accepted 제출을 확인해 이미 푼 문제를 최대한 제외하고 다음 문제 후보를 고릅니다.",
    icon: Target,
    className: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "풀이 검증",
    description:
      "titleSlug가 최근 Accepted 제출에 있으면 SOLVED, 없으면 UNKNOWN으로 안전하게 표시합니다.",
    icon: ShieldCheck,
    className: "bg-violet-50 text-violet-700",
  },
];

const rankStyles = [
  {
    badge: "bg-amber-100 text-amber-800 ring-amber-200",
    icon: "bg-amber-50 text-amber-600",
    border: "border-amber-200 bg-amber-50/40",
  },
  {
    badge: "bg-slate-100 text-slate-700 ring-slate-200",
    icon: "bg-slate-100 text-slate-600",
    border: "border-slate-200 bg-white",
  },
  {
    badge: "bg-orange-100 text-orange-800 ring-orange-200",
    icon: "bg-orange-50 text-orange-600",
    border: "border-orange-100 bg-white",
  },
];

type LandingPageProps = {
  topTeams?: LandingTopTeam[];
};

function formatLeaderName(teamLeader: string | null) {
  return teamLeader ? `@${teamLeader}` : "팀장 정보 없음";
}

export function LandingPage({ topTeams = [] }: LandingPageProps) {
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
            공개 username만 입력하면 풀이 기록, 언어 통계, 태그별 강점, 최근
            Accepted 기반 추천까지 바로 확인할 수 있어요.
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
                <Icon
                  className={`h-11 w-11 rounded-lg p-2 ${card.className}`}
                />
                <h3 className="mt-5 text-xl font-semibold text-slate-950">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {card.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                <Trophy className="h-4 w-4" />
                Team leaderboard
              </div>
              <h2 className="mt-3 text-3xl font-bold tracking-normal text-slate-950 sm:text-4xl">
                지금 가장 활발한 상위 팀
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                팀별 해결 문제 수를 기준으로 상위 3개 팀을 보여줍니다.
              </p>
            </div>
            <Link
              href="/teams"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-blue-200 hover:text-blue-700"
            >
              전체 팀 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {topTeams.length > 0 ? (
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {topTeams.map((team, index) => {
                const style = rankStyles[index] ?? rankStyles[1];

                return (
                  <article
                    key={team.teamId}
                    className={`rounded-lg border p-6 shadow-[0_16px_45px_rgba(15,23,42,0.06)] ${style.border}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg ${style.icon}`}
                      >
                        {team.rank === 1 ? (
                          <Crown className="h-6 w-6" />
                        ) : (
                          <Medal className="h-6 w-6" />
                        )}
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${style.badge}`}
                      >
                        {team.rank}위
                      </span>
                    </div>

                    <h3 className="mt-5 truncate text-xl font-bold text-slate-950">
                      {team.teamName}
                    </h3>
                    <p className="mt-2 truncate text-sm font-medium text-slate-500">
                      {formatLeaderName(team.teamLeader)}
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-slate-200 bg-white/80 p-4">
                        <div className="text-2xl font-bold text-slate-950">
                          {team.solved.toLocaleString()}
                        </div>
                        <div className="mt-1 text-xs font-medium text-slate-500">
                          해결 문제
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-white/80 p-4">
                        <div className="flex items-center gap-2 text-2xl font-bold text-slate-950">
                          <UsersRound className="h-5 w-5 text-slate-400" />
                          {team.memberCount.toLocaleString()}
                        </div>
                        <div className="mt-1 text-xs font-medium text-slate-500">
                          팀원
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-10 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
              <p className="text-base font-semibold text-slate-800">
                아직 집계된 팀 랭킹이 없습니다.
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                팀이 문제를 해결하면 이곳에 상위 3개 팀이 표시됩니다.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col w-full justify-center py-32 pb-60 sm:py-44 md:py-60 lg:py-80 lg:pb-96 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-xl sm:2xl md:text-3xl lg:text-4xl mb-24 md:mb-32 lg:mb-52 hover:scale-125 duration-100">
            <span className="inline-block text-blue-600 font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl pb-6">
              알고리즘과 자료구조
            </span>
            ,<br /> 과연
            <span className="text-orange-600 font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              {" "}
              지금도{" "}
            </span>
            공부해야 하나?
          </div>
          <div className="space-y-40 sm:space-y-48 md:space-y-60 lg:space-y-60 w-[100%] px-6 sm:px-12 md:px-16 lg:px-20 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-8 md:gap-12 lg:gap-20">
              <div className="flex flex-col p-5 rounded-xl space-y-3 hover:shadow-xl hover:-translate-y-2 duration-300 transition-all">
                <Chip
                  label="CODING TEST"
                  className="w-fit hover:scale-105"
                  color="warning"
                  sx={{
                    "& .MuiChip-label": {
                      fontSize: {
                        xs: "0.75rem",
                        md: "1rem",
                      },
                    },
                  }}
                ></Chip>
                <span className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
                  서류 합격해도 면접장 구경 못하는 현실
                </span>
                <p className="text-base sm:text-lg md:text-xl text-slate-500 font-medium">
                  <span className="inline-block pb-2">
                    밤새 만든 포트폴리오,
                    <br className="lg:hidden" /> 보여줄 기회조차 없다면?
                  </span>
                  <br />
                  <span className="inline-block pt-2 pb-1">
                    <b>&apos;코딩 테스트&apos;</b>라는 <b>장벽</b>,
                  </span>
                  <br />
                  <span className="inline-block">
                    이제 <b>면접으로 가는 다리</b>가 됩니다.
                  </span>
                </p>
              </div>
              <div className="flex flex-col w-[100%] h-[100%] md:p-5 items-center justify-center">
                <Image
                  src={img_HRProcess.src}
                  alt="img"
                  width={600}
                  height={600}
                  className="rounded-2xl shadow-lg w-[100%] h-auto"
                ></Image>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 justify-center items-center gap-8 md:gap-12 lg:gap-20">
              <div className="flex flex-col order-2 md:order-1">
                <Image
                  src={img_competency.src}
                  alt="img"
                  width={600}
                  height={600}
                  className="w-[100%] h-auto"
                ></Image>
              </div>
              <div className="flex flex-col  p-5 rounded-xl space-y-3 order-1 md:order-2 hover:shadow-xl hover:-translate-y-2 duration-300 transition-all">
                <Chip
                  label="FUNDAMENTAL"
                  className="w-fit hover:scale-105"
                  color="success"
                  sx={{
                    "& .MuiChip-label": {
                      fontSize: {
                        xs: "0.75rem",
                        md: "1rem",
                      },
                    },
                  }}
                ></Chip>
                <span className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
                  AI 시대에 요구되는 역량은
                  <br /> 기본기로부터 나옵니다.
                </span>
                <p className="text-base sm:text-lg md:text-xl text-slate-500 font-medium pt-2">
                  <span className="inline-block pb-2">
                    <b>&apos;문제 정의 및 구조화&apos;</b>, <b>&apos;테스트와 검증&apos;</b>,{" "}
                    <b>&apos;설계 능력&apos;</b>
                  </span>
                  <br />
                  <span className="inline-block">
                    그 시작은 <b>&apos;알고리즘&apos;</b>과 <b>자료구조&apos;</b>입니다.
                  </span>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-8 md:gap-12 lg:gap-20">
              <div className="flex flex-col p-5 rounded-xl space-y-3 hover:shadow-xl hover:-translate-y-2 duration-300 transition-all">
                <Chip
                  label="CODE REVIEW"
                  className="w-fit hover:scale-105"
                  color="primary"
                  sx={{
                    "& .MuiChip-label": {
                      fontSize: {
                        xs: "0.75rem",
                        md: "1rem",
                      },
                    },
                  }}
                ></Chip>
                <span className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">
                  기술 면접부터 실무까지
                </span>
                <p className="text-base sm:text-lg md:text-xl text-slate-500 font-medium pt-2">
                  <span className="inline-block pb-2">
                    코드가 작성된 <b>배경</b>과 <b>이유</b>를
                    <br className="md:hidden" />
                    <b> 논리적</b>으로
                    <b> 설명</b>해야 합니다.
                  </span>
                  <br />
                  <span className="inline-block">
                    <b>의사소통 능력</b>은 프로젝트에서{" "}
                    <br className="md:hidden" /> 정말 중요합니다.
                  </span>
                </p>
              </div>
              <div className="flex flex-col w-[100%] h-[100%] items-center justify-center">
                <div className="relative relative w-[100%] h-[100%]">
                  <Image
                    src={img_codeReview.src}
                    alt="techInterview"
                    width={400}
                    height={400}
                    className="absolute top-[50%] left-[50%] md:left-[20%] lg:left-[30%] z-0 rounded-2xl shadow-xl w-fit max-w-[45vw] md:max-w-[33vw] lg:max-w-[25vw] h-auto"
                  ></Image>
                  <Image
                    src={img_meeting.src}
                    alt="meeting"
                    width={400}
                    height={400}
                    className="absolute top-[10%] left-[0%] z-10 rounded-2xl shadow-xl w-fit max-w-[45vw] md:max-w-[33vw] lg:max-w-[25vw] h-auto"
                  ></Image>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
