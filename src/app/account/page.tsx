import { redirect } from "next/navigation";
import { AccountForm } from "@/components/auth/account-form";
import { createClient } from "@/utils/supabase/server";
import Chip from "@mui/material/Chip";
import { BarChart } from "./charts";
import { FaCode } from "react-icons/fa6";
import { IoPricetagOutline } from "react-icons/io5";

async function getUserProfile(username: string) {
  const res = await fetch(
    `http://localhost:3000/api/leetcode/user?username=${encodeURIComponent(username.trim())}`,
  );
  const data = await res.json();
  const userProfile = data.profile;
  console.log(userProfile);
  return userProfile;
}
interface tagSkill {
  tagName: string;
  tagSlug: string;
  problemsSolved: number;
}

interface tagSkillStats {
  fundamental: tagSkill[];
  intermediate: tagSkill[];
  advanced: tagSkill[];
}

async function getTagSkillStats(username: string): Promise<tagSkillStats> {
  const res = await fetch(
    `http://localhost:3000/api/leetcode/skill?username=${encodeURIComponent(username.trim())}`,
  );
  const data = await res.json();
  const TagSkillStats = data.groups;
  return TagSkillStats;
}
interface langStatsType {
  languageName: string;
  problemsSolved: number;
}
interface langsStatsType {
  username: string;
  languages: langStatsType[];
}

async function getLanguageStats(username: string): Promise<langsStatsType> {
  const res = await fetch(
    `http://localhost:3000/api/leetcode/language?username=${encodeURIComponent(username.trim())}`,
  );
  const data = await res.json();
  const languageStats = data;
  return languageStats;
}
export const dynamic = "force-dynamic";
export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("nickname, username, email, date_signup")
    .eq("id", user.id)
    .maybeSingle();

  const nickname = profile?.nickname;
  const username = profile?.username;
  const email = profile?.email || "email@example.com";
  const signUpDate = new Date(profile?.date_signup).toLocaleDateString();
  const leetcodeProfile = await getUserProfile(username);
  const avatarUrl = leetcodeProfile.avatarUrl;
  const ranking = leetcodeProfile.ranking;
  const reputation = leetcodeProfile.reputation;
  const langStats = await getLanguageStats(username);
  const tagSkillStats = await getTagSkillStats(username);

  return (
    <main className=" w-[100%] mx-auto mt-5 mb-28 sm:px-6 lg:px-8">
      <div className="wrapper_title w-[100%]">
        <div className="border-b-2 border-gray-200 my-8">
          <div className="text-3xl font-semibold py-2">
            <span>내 정보</span>
          </div>
          <div className="text-xl font-medium text-gray-500 py-2">
            <span>계정 정보를 확인하고 관리하세요.</span>
          </div>
        </div>
        <div className="wrapper_info flex flex-row w-[100%]">
          <form className="w-[30%]">
            <div className="wrapper_userInfo flex flex-col border border-gray-100 rounded-xl mr-5 bg-white p-5">
              <div className="userAvatar flex justify-center">
                <img
                  src={avatarUrl}
                  alt="img_Avatar"
                  width="200px"
                  height="300px"
                  className="my-10 rounded-full object-cover"
                ></img>
              </div>
              <div className="user_info flex flex-row border-b-[0.2px] border-gray-100 px-2 pt-5 pb-1 w-[100%] justify-between items-center">
                <div>
                  <span className="text-gray-500 text-base">활동명</span>
                </div>
                <div>
                  <span className="text-lg">{nickname}</span>
                </div>
                <div>
                  <button className="text-blue-600 text-base">수정</button>
                </div>
              </div>
              <div className="user_info flex flex-row border-b-[0.2px] border-gray-100 px-2 pt-5 pb-1 justify-between items-center">
                <div>
                  <span className="text-gray-500 text-base">이름</span>
                </div>
                <div>
                  <span className="text-sm">{username}</span>
                </div>
                <div>
                  <button className="text-blue-600 text-base">수정</button>
                </div>
              </div>
              <div className="user_info flex flex-row border-b-[0.2px] border-gray-100 px-2 pt-5 pb-1 justify-between items-center">
                <div>
                  <span className="text-gray-500 text-base">이메일</span>
                </div>
                <div>
                  <span className="text-sm">{email}</span>
                </div>
                <div>
                  <button className="text-blue-600 text-base">수정</button>
                </div>
              </div>
              <div className="user_info flex flex-row border-b-[0.2px] border-gray-100 px-2 pt-5 pb-1 justify-between items-center">
                <div>
                  <span className="text-gray-500 text-base">가입일</span>
                </div>
                <div>
                  <span className="text-lg">{signUpDate}</span>
                </div>
              </div>
              <div className="user_info flex flex-row border-b-[0.2px] border-gray-100 px-2 pt-5 pb-1 justify-between items-center">
                <div>
                  <span className="text-gray-500 text-base">Ranking</span>
                </div>
                <div>
                  <span className="text-base">{ranking}</span>
                </div>
              </div>
              <div className="user_info flex flex-row px-2 pt-5 pb-1 justify-between items-center">
                <div>
                  <span className="text-gray-500 text-base">Reputation</span>
                </div>
                <div>
                  <span className="text-base">{reputation}</span>
                </div>
              </div>
            </div>
          </form>
          <div className="w-[65%]">
            <div className="wrapper_stats max-w-[100%]">
              <div className="stats_lang border-gray-200 border rounded-xl bg-white mb-3 py-5">
                <div className="px-3 pb-3">
                  <FaCode className="inline-block mr-2 w-6 h-6 text-blue-500" />
                  <span className=" text-xl font-semibold">Language stats</span>
                </div>
                <div className="barChart p-10 flex h-[450px] justify-center">
                  <BarChart
                    labels={langStats.languages.map(
                      (item) => item.languageName,
                    )}
                    labelTitle="value"
                    data={langStats.languages.map(
                      (item) => item.problemsSolved,
                    )}
                    chartTitle="Languaage stats"
                  ></BarChart>
                </div>
              </div>
              <div className="stats_skillTag border-gray-200 border rounded-xl bg-white my-3 py-5">
                <div className="px-3 pb-3">
                  <IoPricetagOutline className="inline-block mr-2 w-6 h-6 text-[#1E293B]" />
                  <span className="text-xl font-semibold">Tag skill stats</span>
                </div>
                <ul className="list-disc list-inside pl-5">
                  <li className="marker:text-red-500">Advanced</li>
                  <div className="tagsAd">
                    {tagSkillStats.advanced.map((item, index: number) => (
                      <Chip
                        key={index}
                        color="error"
                        label={`${item.tagName}-${item.problemsSolved}`}
                        className="mx-1 my-1"
                      />
                    ))}
                  </div>
                  <li className="marker:text-orange-500">Intermediate</li>
                  <div className="tagsInter">
                    {tagSkillStats.intermediate.map((item, index: number) => (
                      <Chip
                        key={index}
                        color="warning"
                        label={`${item.tagName}-${item.problemsSolved}`}
                        className="mx-1 my-1"
                      />
                    ))}
                  </div>
                  <li className="marker:text-green-700">Fundamental</li>
                  <div className="tagsFund">
                    {tagSkillStats.fundamental.map((item, index: number) => (
                      <Chip
                        key={index}
                        color="success"
                        label={`${item.tagName}-${item.problemsSolved}`}
                        className="mx-1 my-1"
                      />
                    ))}
                  </div>
                </ul>
              </div>
            </div>
            <div className="wrapper_delete w-[100%] mt-20">
              <div className="redbox bg-red-100 border-red-200 border rounded-2xl px-5 py-3 flex flex-row justify-between">
                <div className="caution">
                  <div>
                    <span className="text-xl font-semibold">
                      ! Delete Account
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-red-800">
                      If you delete your account, all data will be permanently
                      deleted and cannot be recovered.
                    </span>
                  </div>
                </div>
                <button className="text-white bg-red-500 rounded-lg px-2 py-1 h-full">
                  계정 삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
