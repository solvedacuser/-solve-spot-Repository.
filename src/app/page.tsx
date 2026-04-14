"use client";

import { useState } from "react";
import Link from "next/link";
import { PlatformInfo, PlatformLogo } from "@/components/platformLogo";
import Footer from "@/components/footer";
import Card from "@/components/card";
import ActiveContent from "@/components/content";
import { ActiveCardType } from "@/components/content";

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
            className="flex w-fit h-fit bg-white-50 text-2xl tracking-tight justify-center items-center
          text-black-50 font-bold p-4 shadow-lg border-[1.1px] rounded-3xl cursor-pointer hover:scale-105 hover:shadow-xl trasition-transform duraiton-1000"
            href="./login"
          >
            지금 바로 시작하기
          </Link>
        </section>

        <section className="w-full h-[100rem] text-black backdrop-blur-sm">
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
      <Footer />
    </>
  );
}
