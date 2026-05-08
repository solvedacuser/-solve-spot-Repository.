"use client";

import { useState } from "react";
import Link from "next/link";

type ActiveCardType = "teamStudy" | "recommend" | "share" | "chart";

function Card({
  imgSrcPath,
  title,
  description,
}: {
  imgSrcPath: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="flex flex-col w-[370px] md:w-[450px] h-auto bg-white/50 border border-[#f0f0f0] rounded-lg shadow-lg items-center hover:scale-105 hover:brightness-100">
        <div className="flex flex-row items-center w-full px-5 pt-7 pb-2 gap-3 my-3 text-[#333388]">
          <img src={imgSrcPath} alt="icon_teamPlay" className="w-12 h-12" />
          <span className="text-2xl">
            <b>{title}</b>
          </span>
        </div>
        <div className="flex flex-row items-center w-full p-5 text-xl text-[#555588]">
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

function ActiveContent({ activeCard }: { activeCard: ActiveCardType }) {
  const activeContent = {
    teamStudy: <img src="/example.png" />,
    recommend: <img src="/example.png" />,
    share: <img src="/example.png" />,
    chart: <img src="/example.png" />,
  };

  return (
    <div className="w-[80%] h-fit mx-auto p-10 md:p-10 bg-white/50 rounded-3xl shadow mb-20 text-center">
      <span className="text-2xl">{activeCard}</span>
      {activeContent[activeCard]}
    </div>
  );
}

const PlatformInfo = {
  name: "Solve Spot",
  logoSrc: "/waypoints.svg",
};

export default function HomePage() {
  const [activeCard, setActiveCard] = useState<ActiveCardType>("teamStudy");

  return (
    <>
      <main className="flex flex-col min-h-[calc(100vh-120px)] items-center justify-center px-4">
        <section className="intro flex flex-col w-full min-h-[950px] items-center justify-center gap-2">
          <h1 className="text-6xl md:text-8xl text-center tracking-tight font-bold whitespace-nowrap hover:scale-105 transition-transform duration-500">
            다같이 성장하는
            <br />
            {PlatformInfo.name}
          </h1>
          <p className="text-xl md:text-3xl text-[#6f6f6f] my-6 hover:scale-105 transition-transform duration-500">
            발자국들이 모여 길을 만듭니다.
            <br />
            함께 성장하는 길에 참여하세요.
          </p>
          <Link
            className="flex w-fit h-fit bg-white text-2xl tracking-tight justify-center items-center
          text-black-50 font-bold p-4 shadow-lg border-[1.1px] rounded-3xl cursor-pointer hover:scale-105 hover:shadow-xl trasition-transform duraiton-1000"
            href="./login"
          >
            지금 바로 시작하기
          </Link>
        </section>
        <section className="w-full h-[100rem] text-black backdrop-blur-sm my-10">
          <div className="grid grid-cols-1 md:grid-cols-2 w-fit gap-[50px] mx-auto px-10 py-20">
            <button onClick={() => setActiveCard("teamStudy")}>
              <Card
                imgSrcPath="users.svg"
                title="팀과 함께"
                description="팀원과 함께 문제를 해결해요."
              ></Card>
            </button>
            <button onClick={() => setActiveCard("recommend")}>
              <Card
                imgSrcPath="signpost.svg"
                title="문제 추천"
                description="팀이 지향하는 방향에 맞춘 문제를 추천해요."
              ></Card>
            </button>
            <button onClick={() => setActiveCard("share")}>
              <Card
                imgSrcPath="/share.svg"
                title="문제풀이 공유"
                description="문제풀이를 공유하며 함께 성장해요."
              ></Card>
            </button>
            <button onClick={() => setActiveCard("chart")}>
              <Card
                imgSrcPath="/chart.svg"
                title="학습 기록 관리"
                description="스스로 학습 상황을 한눈에 확인하세요."
              ></Card>
            </button>
          </div>
          <ActiveContent activeCard={activeCard} />
        </section>
      </main>
    </>
  );
}
