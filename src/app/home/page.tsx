"use client";

import { useState } from "react";
import Link from "next/link";
import exImage from "@/images/example.png";
import chartImage from "@/images/chart.svg";
import shareImage from "@/images/share.svg";
import signpostImage from "@/images/signpost.svg";
import usersImage from "@/images/users.svg";
import waypointsImage from "@/images/waypoints.svg";

const PlatformInfo = {
  name: "Solve Spot",
  logoSrc: waypointsImage.src,
};

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
  const iconName = imgSrcPath.split("/").pop()?.split(".")[0];

  return (
    <div>
      <div className="flex flex-col w-full max-w-[450px] h-auto bg-white/50 border border-[#f0f0f0] rounded-lg shadow-lg items-center hover:scale-105 hover:brightness-100">
        <div className="flex flex-row items-center w-full px-5 pt-7 pb-2 gap-3 my-3 text-[#333388]">
          <img
            src={imgSrcPath}
            alt={"icon_" + iconName}
            className="w-12 h-12"
          />
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
    teamStudy: (
      <img className="w-full h-auto object-contain" src={exImage.src} />
    ),
    recommend: (
      <img className="w-full h-auto object-contain" src={exImage.src} />
    ),
    share: <img className="w-full h-auto object-contain" src={exImage.src} />,
    chart: <img className="w-full h-auto object-contain" src={exImage.src} />,
  };

  return (
    <div className="w-[95%] md:w-[80%] h-fit mx-auto p-10 md:p-10 bg-white/50 rounded-3xl shadow mb-20 text-center">
      <span className="text-2xl">{activeCard.toUpperCase()}</span>
      {activeContent[activeCard]}
    </div>
  );
}

export default function HomePage() {
  const [activeCard, setActiveCard] = useState<ActiveCardType>("teamStudy");

  return (
    <>
      <main className="flex flex-col min-h-[calc(100vh-120px)] items-center justify-center px-4">
        <section className="intro flex flex-col w-full h-auto items-center justify-center gap-2 py-56">
          <h1 className="text-4xl md:text-6xl lg:text-8xl text-center tracking-tight font-bold break-keep hover:scale-105 transition-transform duration-500">
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
            className="flex w-fit h-fit bg-white text-lg md:text-2xl tracking-tight justify-center items-center
          text-black/70 font-bold p-3 md:p-4 shadow-lg border-[1.1px] rounded-3xl cursor-pointer hover:scale-105 hover:shadow-xl transition-transform duration-300"
            href="./login"
          >
            지금 바로 시작하기
          </Link>
        </section>
        <section className="w-fit h-auto text-black backdrop-blur-sm my-10">
          <div className="grid grid-cols-1 md:grid-cols-2 w-fit gap-[50px] mx-auto px-4 md:px-10 py-20">
            <button onClick={() => setActiveCard("teamStudy")}>
              <Card
                imgSrcPath={usersImage.src}
                title="팀과 함께"
                description="팀원과 함께 문제를 해결해요."
              ></Card>
            </button>
            <button onClick={() => setActiveCard("recommend")}>
              <Card
                imgSrcPath={signpostImage.src}
                title="문제 추천"
                description="팀이 지향하는 방향에 맞춘 문제를 추천해요."
              ></Card>
            </button>
            <button onClick={() => setActiveCard("share")}>
              <Card
                imgSrcPath={shareImage.src}
                title="문제풀이 공유"
                description="문제풀이를 공유하며 함께 성장해요."
              ></Card>
            </button>
            <button onClick={() => setActiveCard("chart")}>
              <Card
                imgSrcPath={chartImage.src}
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
