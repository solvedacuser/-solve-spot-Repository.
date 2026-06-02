import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, BarChart, DoughnutChart, Calendar, LineChart } from "./charts";
import { LuChartColumn } from "react-icons/lu";
import { RiDonutChartLine } from "react-icons/ri";
import { FiTrendingUp } from "react-icons/fi";
import { LuCalendarCheck } from "react-icons/lu";
import { AttendceRateCard } from "./charts";
import Link from "next/link";
import { TbBulb } from "react-icons/tb";

function getDatefor7days() {
  const dateDaysAgo = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dateDaysAgo.push(date);
  }
  return dateDaysAgo;
}

async function getStreak(username: string, year: string): Promise<number> {
  const res = await fetch(
    `http://localhost:3000/api/leetcode/calendar?username=${encodeURIComponent(username.trim())}&year=${encodeURIComponent(year.trim())}`,
  );
  const data = await res.json();
  const streak = data.streak;
  return streak;
}

function calculateSolvedEachDayfor7days(solvedDateList: Array<Date>) {
  const solvedEachDay = [0, 0, 0, 0, 0, 0, 0, 0];
  const recentDatefor7days = getDatefor7days();
  solvedDateList.forEach((solvedDate) => {
    recentDatefor7days.forEach((item, index) => {
      if (item.toLocaleDateString() == solvedDate.toLocaleDateString()) {
        solvedEachDay[index]++;
      }
    });
  });
  return solvedEachDay;
}

function calculateSolvedMonthly(solvedDateList: Array<Date>) {
  const solvedMonthly = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  solvedDateList.forEach((item) => {
    solvedMonthly[item.getMonth()]++;
  });
  return solvedMonthly;
}

function formatCalendarData(solvedDateList: Array<Date>) {
  let calendarData: Array<{ date: string; count: number }> = [];
  solvedDateList?.sort((a, b) => a.getTime() - b.getTime());
  let last, itemDate;
  solvedDateList.forEach((item) => {
    last = calendarData.at(-1);
    itemDate = Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(item);
    if (last) {
      if (last.date == itemDate) {
        last.count++;
      } else {
        calendarData.push({ date: itemDate, count: 1 });
      }
    } else {
      calendarData.push({ date: itemDate, count: 1 });
    }
  });
  return calendarData;
}

function calculateAttendaceRate(daysAttended: number, signup_at: Date) {
  const oneDayInMs = 1000 * 60 * 60 * 24;
  const today = Date.now();
  const attendceRate = Math.floor(
    (daysAttended / ((today - signup_at.getTime()) / oneDayInMs)) * 100,
  );

  return attendceRate;
}

export const dynamic = "force-dynamic";

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("leetcode_username, signup_at")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };
  if (!profile) {
    console.log("profile 데이터: null");
  }

  const { data: record } = user
    ? await supabase
        .from("team_mission_solves")
        .select("*")
        .eq("leetcode_username", profile?.leetcode_username.trim())
    : { data: null };
  if (!record) {
    console.log("record 데이터: null");
  }

  const { data: teams } = user
    ? await supabase
        .from("team_members")
        .select("user_id")
        .eq("user_id", user.id)
    : { data: null };
  if (!teams) {
    console.log("teams 데이터: null");
  }

  const solvedDateList: Date[] =
    record?.map((item) => new Date(item.solved_at)) ?? [];
  const username: string = profile?.leetcode_username;
  const year: number = new Date().getFullYear();
  const totalTeams: number = teams?.length || 0;
  const streak: number = (await getStreak(username, year.toString())) | 1;
  const numSolvedDailyLast7Days: number[] = calculateSolvedEachDayfor7days(
    solvedDateList,
  ) || [0, 0, 0, 0, 0, 0, 0];
  const numSolvedEasy: number =
    record?.filter((item) => item.difficulty == "Easy").length || 0;
  const numSolvedMedium: number =
    record?.filter((item) => item.difficulty == "Medium").length || 0;
  const numSolvedHard: number =
    record?.filter((item) => item.difficulty == "Hard").length || 0;

  const totalSolved: number = numSolvedEasy + numSolvedMedium + numSolvedHard;
  const numSolvedMonthly: number[] = calculateSolvedMonthly(solvedDateList) || [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  const annualActivity = formatCalendarData(solvedDateList) || [];
  const EachDateLast7days: Date[] = getDatefor7days();
  const labelsDate = EachDateLast7days.map((date) => {
    const lMonth = date.getMonth() + 1;
    const lDate = date.getDate();
    const formattedDate = lMonth + "/" + lDate;
    return formattedDate;
  });
  const labelsForMonthly = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  const progress = calculateAttendaceRate(
    annualActivity.length,
    new Date(profile?.signup_at),
  );
  return (
    <div className="flex flex-col items-center mt-16 mb-28">
      <div className="w-[80%] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-8">
          <Card
            title="총 해결한 문제"
            info={totalSolved}
            iconComponentName="checkCircle"
          ></Card>
          <Card
            title="참여 중인 팀"
            info={totalTeams}
            iconComponentName="team"
          ></Card>
          <Card
            title="연속 학습일"
            info={streak}
            iconComponentName="fire"
          ></Card>
          <AttendceRateCard progress={progress}></AttendceRateCard>
        </div>
      </div>
      <div className="w-[80%] h-[400px] flex flex-row mt-5">
        <div className="w-[66%] h-[100%] mr-2 bg-white p-6 border-2 border-gray rounded-lg">
          <div className="flex items-center">
            <LuChartColumn className="inline-block w-5 h-5 text-blue-500 mr-2" />
            <span className="font-bold text-base md:text-lg">
              최근 7일동안 해결한 문제 수
            </span>
          </div>
          <BarChart
            labels={labelsDate}
            labelTitle="날마다 해결한 문제 수"
            data={numSolvedDailyLast7Days}
            chartTitle="최근 7일동안 해결한 문제 수"
          ></BarChart>
        </div>
        <div className="w-[34%] h-[100%] bg-white ml-2 px-6 pt-6 pb-16 border-2 border-gray rounded-lg">
          <div className="flex items-center">
            <RiDonutChartLine className="inline-block w-6 h-6 text-orange-500 mr-2" />
            <span className="font-bold text-base md:text-lg">
              난이도별 해결
            </span>
          </div>
          {totalSolved ? (
            <DoughnutChart
              labels={["Easy", "Medium", "Hard"]}
              label="난이도별 해결한 문제 수"
              data={[
                Number(numSolvedEasy),
                Number(numSolvedMedium),
                Number(numSolvedHard),
              ]}
            ></DoughnutChart>
          ) : (
            <div className="flex flex-col w-full h-full items-center justify-center">
              <div className="flex w-full items-center justify-center py-5">
                <p className="inline-block text-lg md:text-xl text-center">
                  현재 학습 기록이 없습니다.
                  <br />
                  학습 여정을 지금 시작하세요.
                </p>
              </div>
              <div className="border border-slate-400 py-2 px-10 rounded-lg hover:text-orange-600">
                <TbBulb className="inline-block w-6 h-6 mr-3" />
                <Link href={"./teams"} className="text-lg text-black">
                  시작하기
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-[80%] mx-auto bg-white p-6 border border-gray-200 rounded-lg my-5">
        <div>
          <FiTrendingUp className="inline-block w-6 h-6 text-green-500 mr-2" />
          <span className="font-bold text-base md:text-lg">
            매월 해결한 문제 수
          </span>
        </div>
        <div className="px-12 py-3">
          <LineChart
            labels={labelsForMonthly}
            label="Monthly Solved"
            data={numSolvedMonthly}
          ></LineChart>
        </div>
      </div>
      <div className="w-full">
        <div className="mx-auto w-[80%] mt-5 bg-white p-5 border-2 border-gray rounded-lg">
          <div className="flex items-center mb-8">
            <LuCalendarCheck className="inline-block w-6 h-6 mr-2 text-red-500" />
            <span className="font-semibold text-base md:text-lg">
              학습 여정
            </span>
          </div>
          <Calendar activityData={annualActivity} year={year}></Calendar>
          <div className="flex items-center justify-end gap-2 text-xs md:test-base text-gray-500">
            <span>Less</span>
            <ul className="flex gap-0.5 md:gap-1">
              <li className="w-2 h-2 md:w-3 md:h-3 rounded-sm color-empty-bg"></li>
              <li className="w-2 h-2 md:w-3 md:h-3 rounded-sm color-scale-1-bg"></li>
              <li className="w-2 h-2 md:w-3 md:h-3 rounded-sm color-scale-2-bg"></li>
              <li className="w-2 h-2 md:w-3 md:h-3 rounded-sm color-scale-3-bg"></li>
              <li className="w-2 h-2 md:w-3 md:h-3 rounded-sm color-scale-4-bg"></li>
            </ul>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
