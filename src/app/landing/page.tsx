import Link from "next/link";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { GiTeamIdea } from "react-icons/gi";
import { GoGoal } from "react-icons/go";
import { DiGoogleAnalytics } from "react-icons/di";
import { BsStars } from "react-icons/bs";
import { TbCalendarCode } from "react-icons/tb";
import { FaUsers } from "react-icons/fa";
import { HiOutlinePlay } from "react-icons/hi2";

interface CardProps {
  title: string;
  description: string;
  details: string[];
}

function Card({ title, description, details }: CardProps) {
  const detailList = details?.map((detail, index) => {
    return (
      <li key={index}>
        <CheckCircleOutlinedIcon className="text-green-600 mr-1"></CheckCircleOutlinedIcon>
        <span className="text-sm">{detail}</span>
      </li>
    );
  });

  return (
    <>
      <div className="card w-fit">
        <p>
          <span className="inline-block mt-4">{title}</span>
          <br />
          <span className="inline-block mt-1 text-gray-500">{description}</span>
        </p>
      </div>
      <ul className="space-y-2 mt-4">{detailList}</ul>
    </>
  );
}

export default function landingPage() {
  const titles = {
    title_1: "팀 스터디",
    title_2: "학습 관리",
    title_3: "AI 학습 헬퍼",
  };
  const descriptions = {
    description_1: "명확한 목표를 가진 팀원들과 함께 빠르게 성장해요.",
    description_2: "학습 상황을 자동 기록하고, 꾸준한 학습 경험을 만들어요.",
    description_3: "AI 분석을 통해 문제 접근에 대한 새로운 인사이트를 얻어요.",
  };
  const details = {
    detail_1: ["문제 추천", "스터디 현황 추적", "소스코드 피드백"],
    detail_2: ["학습 상황 기록", "시각화된 대시보드", "학습 습관 형성"],
    detail_3: ["AI 소스코드 분석", "AI 피드백", "복습 문제 추천"],
  };

  return (
    <>
      <section className="s1 w-[100%] grid grid-cols-2 justify-between items-center px-32 py-16">
        <div className="mx-auto">
          <h1 className="text-5xl lg:text-7xl font-bold text-slate-900">
            다같이 성장하는 <br />
            <span className="text-blue-600">Solve Spot</span>
          </h1>
          <p className="text-xl text-slate-600 mt-10">
            협업과 혁신을 위한 올인원 플랫폼.
            <br />
            팀의 생산성을 극대화하고 목표를 달성하세요.
          </p>
          <div className="mt-10 flex flex-row gap-4">
            <Link
              href=""
              className="border rounded-lg bg-black text-white px-8 py-1"
            >
              지금 시작하기
            </Link>
            <Link href="" className="border rounded-lg bg-white px-6 py-1">
              <HiOutlinePlay className="inline-block w-5 h-5 mr-1" />
              서비스 영상 보기
            </Link>
          </div>
        </div>
        <div className="mx-auto px-8">
          <img
            src={
              "https://images.unsplash.com/photo-1535957998253-26ae1ef29506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNoJTIwd29ya3NwYWNlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3OTIwMTU1M3ww&ixlib=rb-4.1.0&q=80&w=1080"
            }
            alt="brand_img"
            className="rounded-3xl shadow-2xl w-[100%] h-[70%] shadow-blue-600/40"
          ></img>
        </div>
      </section>

      <section className="s2 w-[100%] flex flex-col py-28 px-6 bg-slate-50">
        <div className="mx-auto mb-10 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            어렵기만 하던 알고리즘, <span className="text-5xl"> 다함께 </span>
            돌파해요
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            모든 팀원이 하나의 플랫폼에서 <b>협력</b>하고 <b>성장</b>할 수
            있어요
          </p>
        </div>
        <div className="inline-grid grid-cols-3 gap-16 px-28 ">
          <div className="border-gray-100 border rounded-lg bg-white p-6 hover:shadow-lg transition-shadow">
            <GiTeamIdea className="w-10 h-10 bg-blue-200 p-2 rounded-lg text-blue-600" />
            <Card
              title={titles.title_1}
              description={descriptions.description_1}
              details={details.detail_1}
            ></Card>
          </div>
          <div className="border-gray-100 border rounded-lg bg-white p-6 hover:shadow-lg transition-shadow">
            <GoGoal className="w-10 h-10 bg-red-100 p-2 rounded-lg text-red-600" />
            <Card
              title={titles.title_2}
              description={descriptions.description_2}
              details={details.detail_2}
            ></Card>
          </div>
          <div className="border-gray-100 border rounded-lg bg-white p-6 hover:shadow-lg transition-shadow">
            <DiGoogleAnalytics className="w-10 h-10 bg-green-100 p-2 rounded-lg text-green-600" />
            <Card
              title={titles.title_3}
              description={descriptions.description_3}
              details={details.detail_3}
            ></Card>
          </div>
        </div>
      </section>

      <section className="s3 grid grid-cols-2 p-28 py-52">
        <div>
          <img
            src={
              "https://images.unsplash.com/photo-1517048676732-d65bc937f952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG1lZXRpbmd8ZW58MXx8fHwxNzc5MTE5OTMxfDA&ixlib=rb-4.1.0&q=80&w=1080"
            }
            alt="img"
            className="rounded-lg shadow-xl"
          ></img>
        </div>
        <div className="ml-8">
          <h2 className="text-3xl my-5 font-semibold">
            우리가 제공하는 서비스
          </h2>
          <p className="text-lg"></p>
          <ul className="space-y-4">
            <li>
              <div className="flex flex-row my-3 bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <FaUsers className="w-12 h-10 mr-2 text-blue-600 bg-blue-200 p-2 rounded-2xl" />
                <div>
                  <h3 className="text-base font-semibold">팀 스터디</h3>
                  <p className="text-base">
                    스터디 팀 생성, 문제 추천 설정으로 손쉽게 스터디 팀을
                    구성하고, 스터디 진행 상황을 기록하고 보여줍니다.
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="flex flex-row my-3 bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <TbCalendarCode className="w-10 h-10 mr-2 text-red-600 bg-red-200 p-2 rounded-2xl" />
                <div>
                  <h3 className="text-base font-semibold">학습 관리</h3>
                  <p className="text-base">
                    학습 상황을 자동 기록하고, 이를 시각화하여 꾸준한 학습
                    경험을 만듭니다.
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="flex flex-row my-3 bg-white p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <BsStars className="w-10 h-10 mr-2 text-white bg-yellow-200 p-2 rounded-2xl" />
                <div>
                  <h3 className="text-base font-semibold">AI를 통한 학습</h3>
                  <p className="text-base">
                    AI가 소스코드를 분석해 피드백을 주고, 복습 문제를
                    추천해줍니다.
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section className="s4 bg-slate-900 flex flex-col justify-center py-12">
        <div className="text-center py-12">
          <h2 className="text-white text-bold text-4xl p-5">
            수치가 입증하는 성과
          </h2>
          <p className="text-slate-300">SolveSpot이 거둔 성과</p>
        </div>
        <div className="grid grid-cols-4 text-center pb-16">
          <div>
            <h3 className="text-blue-400 text-bold text-5xl p-5 ">3500+</h3>
            <p className="text-slate-300">제공하는 문제 수</p>
          </div>
          <div>
            <h3 className="text-green-400 text-bold text-5xl p-5">1000+</h3>
            <p className="text-slate-300">이용자 수</p>
          </div>
          <div>
            <h3 className="text-orange-400 text-bold text-5xl p-5">250,000+</h3>
            <p className="text-slate-300">이용자가 해결한 문제 수</p>
          </div>
          <div>
            <h3 className="text-yellow-400 text-bold text-5xl p-5">300+</h3>
            <p className="text-slate-300">활동 중인 팀</p>
          </div>
        </div>
        <div className="mx-auto mt-12">
          <Link
            href=""
            className="border rounded-lg bg-gray-100 text-slate-800 px-10 py-2"
          >
            지금 시작하기
          </Link>
        </div>
      </section>
    </>
  );
}
