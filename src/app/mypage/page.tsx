import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import {
  Card,
  BarChart,
  DoughnutChart,
  Calendar,
  // ProfileCard,
  LineChart,
} from "./charts";
import { The_Nautigal } from "next/font/google";
import { date, number } from "zod/v4";
import { recordTraceEvents } from "next/dist/trace";
import { LuChartColumn } from "react-icons/lu";
import { RiDonutChartLine } from "react-icons/ri";
import { FiTrendingUp } from "react-icons/fi";
import { LuCalendarCheck } from "react-icons/lu";

function getDatefor7days() {
  const dateDaysAgo = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dateDaysAgo.push(date);
  }
  return dateDaysAgo;
}

// async function getDailySolvedLast7days(username: string, limit: number) {
//   const res = await fetch("https://leetcode.com/graphql", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       query: `
//         query userRecentAcSubmissions($username: String!, $limit: Int!) {
//           recentAcSubmissionList(username: $username, limit: $limit) {
//             id
//             title
//             titleSlug
//             timestamp
//           }
//         }
//       `,
//       variables: {
//         username: username,
//         limit: limit,
//       },
//     }),
//   });
//   const payload = await res.json();
//   const recentAcSubmissionList = payload.data.recentAcSubmissionList;
//   console.log(recentAcSubmissionList);

//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();

//   const { data: record, error } = user
//     ? await supabase
//         .from("profiles")
//         .select("created_at")
//         .eq("id", user.id)
//         .maybeSingle()
//     : { data: null };
//   console.log(record);

//   // 가입 후 해결한 문제 목록 만들기

//   // const test = 1778667603; 테스트 완료
//   const validAcSubmissionList = recentAcSubmissionList.filter((submission) => {
//     if (
//       submission.timestamp >=
//       Math.floor(new Date(record?.created_at).getTime() / 1000)
//     ) {
//       return submission;
//     }
//   });
//   console.log(validAcSubmissionList);

//   // 유효한 문제들 중 7일 이내의 문제들
//   const todayStart = new Date();
//   todayStart.setDate(todayStart.getDate() - 6);
//   todayStart.setHours(0, 0, 0, 0);
//   const sevenDaysAgo = new Date(todayStart);
//   console.log(sevenDaysAgo.getTime());
//   const startTimestamp = Math.floor(sevenDaysAgo.getTime() / 1000);
//   console.log(startTimestamp);

//   const AcSubmissionListLast7days = validAcSubmissionList.filter(
//     (submission) => {
//       submission.timestamp > startTimestamp;
//       console.log(submission.timestamp);
//       return submission;
//     },
//   );
//   console.log("List is", AcSubmissionListLast7days, "what");

//   const numAcSubmissionLast7days = AcSubmissionListLast7days.length;
//   console.log(AcSubmissionListLast7days);
//   return AcSubmissionListLast7days;
// }

// async function updateSolvedDifficulty(username: string) {
//   const res = await fetch(
//     `http://localhost:3000/api/leetcode/user?username=${encodeURIComponent(username.trim())}`,
//   );
//   const data = await res.json();
//   const solvedDifficulty = data.solved;
//   console.log(solvedDifficulty);
//   return solvedDifficulty;
// }
async function getStreak(username: string, year: string): Promise<number> {
  const res = await fetch(
    `http://localhost:3000/api/leetcode/calendar?username=${encodeURIComponent(username.trim())}&year=${encodeURIComponent(year.trim())}`,
  );
  const data = await res.json();
  const streak = data.streak;
  return streak;
}

export const dynamic = "force-dynamic";

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("error");
    return;
  }
  const { data: record, error } = user
    ? await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };
  if (!record) {
    console.log("데이터: null");
  }

  // console.log(record);
  const username: string = record?.username;
  const year: number = new Date().getFullYear();
  const totalTeams: number = record?.totalTeams || 0;
  const streak: number = await getStreak(username, year.toString());
  const numSolvedDailyLast7Days: number[] = record?.num_solved_daily_last_7days;
  const numSolvedEasy: number = record?.num_solved_easy || 0;
  const numSolvedMedium: number = record?.num_solved_medium || 0;
  const numSolvedHard: number = record?.num_solved_hard || 0;
  const totalSolved: number = numSolvedEasy + numSolvedMedium + numSolvedHard;
  const numSolvedMonthly: number[] = record?.num_solved_monthly;
  //  || [
  //   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  // ];
  const annualActivity = record?.annual_activity;
  //  || [
  //   { date: 1779615957000, count: 0 },
  //   { date: "2026-01-05", count: 0 },
  //   { date: "2026-01-05", count: 0 },
  //   { date: "2026-01-07", count: 0 },
  //   { date: "2026-01-06", count: 0 },
  //   { date: "2026-01-09", count: 0 },
  //   { date: "2026-01-01", count: 0 },
  // ];
  const EachDateLast7days: Date[] = getDatefor7days();

  // const numSolvedDailyLast7days = record?.dail;
  // const activityAYeardata = record?.activityayear;
  // const numTeamsSolved = record?.teamsinvolved || null;
  // const teamsName = numTeamsSolved.map((team) => team.name);
  // const teamsCount = numTeamsSolved.map((team) => team.count);
  // // const solvedDifficulty = await updateSolvedDifficulty(username);
  // const recentAcSubmissionList = await updateDailySolvedLast7days(
  //   username,
  //   100,
  // );
  // console.log("streak is" + streak);
  // console.log("total is" + solvedDifficulty.total);
  // console.log("total is" + solvedEasy);
  // console.log("total is" + solvedMedium);
  // console.log("total is" + solvedHard);
  // console.log("submission is " + recentAcSubmissionList);

  // const { data: profilesLC } = user
  //   ? await supabase
  //       .from("profiles_leetcode")
  //       .select("*")
  //       .eq("id", user.id)
  //       .maybeSingle()
  //   : { data: null };
  // const profilesLeetcode = profilesLC;
  // console.log(profilesLeetcode);

  const labelsDate = EachDateLast7days.map((date) => {
    const lMonth = date.getMonth() + 1;
    const lDate = date.getDate();
    const formattedDate = lMonth + "/" + lDate;
    return formattedDate;
  });

  // let numSolvedEachDayLast7days = [0, 0, 0, 0, 0, 0, 0];
  // recentAcSubmissionList.forEach((submission) => {
  //   const date = new Date(submission.timestamp * 1000);
  //   for (let i = 6; 0 <= i; i--) {
  //     if (
  //       date.getDate() == EachDateLast7days[i].getDate() &&
  //       date.getMonth() == EachDateLast7days[i].getMonth()
  //     ) {
  //       numSolvedEachDayLast7days[i]++;
  //     }
  //   }
  // });

  // console.log(numSolvedEachDayLast7days);
  // console.log(solvedDifficulty.easy);
  // console.log(solvedDifficulty.medium);
  // console.log(solvedDifficulty.hard);
  // console.log("1. " + totalSolved);
  // console.log("2. " + totalTeams);
  // console.log("3. " + streak);
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
          <Card title="Information" info={0} iconComponentName="info"></Card>
        </div>
      </div>
      <div className="w-[80%] h-[400px] flex flex-row mt-5">
        <div className="w-[66%] h-[100%] mr-2 bg-white p-5 border-2 border-gray rounded-lg">
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
        <div className="w-[34%] h-[100%] bg-white ml-2 p-5 border-2 border-gray rounded-lg">
          <div className="flex items-center">
            <RiDonutChartLine className="inline-block w-6 h-6 text-orange-500 mr-2" />
            <span className="font-bold text-base md:text-lg">
              난이도별 해결
            </span>
          </div>
          <DoughnutChart
            labels={["Easy", "Medium", "Hard"]}
            label="solved"
            data={[
              Number(numSolvedEasy),
              Number(numSolvedMedium),
              Number(numSolvedHard),
            ]}
          ></DoughnutChart>
        </div>
      </div>
      <div className="w-[80%] mx-auto bg-white p-10 border border-gray-200 rounded-lg my-5">
        <div>
          <FiTrendingUp className="inline-block w-6 h-6 text-green-500 mr-2" />
          <span className="font-bold text-base md:text-lg">
            매월 해결한 문제 수
          </span>
        </div>
        <LineChart
          labels={[
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
          ]}
          label="value"
          data={numSolvedMonthly}
        ></LineChart>
      </div>
      <div className="w-full">
        <div className="mx-auto w-[80%] mt-5 bg-white p-5 border-2 border-gray rounded-lg">
          <div className="flex items-center mb-8">
            <LuCalendarCheck className="inline-block w-6 h-6 mr-2" />
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
      {/* <div className="relative w-[75%] h-auto my-5 bg-white p-5 border-2 border-gray rounded-lg">
        <div className="relative pb-12 text-base md:text-2xl">
          <span>
            <b>팀별 나의 기여도</b>
          </span>
          <Link
            href="/teamlist"
            className="absolute right-0 bg-white text-lg drop-shadow rounded-lg p-1.5 hover:"
          >
            참여 팀 →
          </Link>
        </div> */}
      {/* <BarChart
          labels={teamsName}
          labelTitle="팀별 해결한 문제 수"
          data={teamsCount}
          chartTitle="팀별 내가 해결한 문제 수"
        ></BarChart> */}
      {/* </div> */}
    </div>
  );
}
