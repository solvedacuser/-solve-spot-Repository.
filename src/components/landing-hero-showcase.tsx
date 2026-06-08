"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Target,
} from "lucide-react";

const codeLines = [
  "function twoSum(nums: number[], target: number) {",
  "  const seen = new Map<number, number>();",
  "",
  "  for (let i = 0; i < nums.length; i++) {",
  "    const need = target - nums[i];",
  "    if (seen.has(need)) return [seen.get(need)!, i];",
  "    seen.set(nums[i], i);",
  "  }",
  "}",
];

type CodeSlide = {
  kind: "code";
  title: string;
  description: string;
};

type ImageSlide = {
  kind: "image";
  title: string;
  description: string;
  imageUrl: string;
};

type ShowcaseSlide = CodeSlide | ImageSlide;

const externalImageSlides: ImageSlide[] = [
  {
    kind: "image",
    title: "코딩 워크스페이스",
    description: "알고리즘 풀이에 집중하는 개발 환경을 보여줍니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1535957998253-26ae1ef29506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    kind: "image",
    title: "팀 스터디",
    description: "함께 문제를 고르고 풀이 흐름을 맞추는 팀 학습 장면입니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const slides: ShowcaseSlide[] = [
  {
    kind: "code",
    title: "풀이 목업",
    description: "추천 문제와 코드 피드백을 한 화면에서 확인합니다.",
  },
  ...externalImageSlides,
];

function CodePreview() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-2xl shadow-slate-900/15 backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600">
            Today&apos;s Pick
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">Two Sum</h2>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          Easy
        </span>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-2xl bg-slate-950 p-4 text-slate-100 shadow-inner">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
            <span className="ml-auto rounded-full bg-slate-800 px-2 py-1 text-[11px] text-slate-300">
              solution.ts
            </span>
          </div>
          <pre className="overflow-hidden text-[12px] leading-6 sm:text-[13px]">
            {codeLines.map((line, index) => (
              <code
                key={`${line}-${index}`}
                className="grid grid-cols-[1.5rem_1fr] gap-3"
              >
                <span className="select-none text-right text-slate-500">
                  {index + 1}
                </span>
                <span className="truncate font-mono">{line || " "}</span>
              </code>
            ))}
          </pre>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-blue-100 bg-blue-50/80 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-800">
              <Target className="h-4 w-4" />
              추천 근거
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              배열과 해시 테이블 복습에 적합한 문제입니다.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-white px-2.5 py-1 text-slate-700">
                Array
              </span>
              <span className="rounded-full bg-white px-2.5 py-1 text-slate-700">
                Hash Table
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
              <Sparkles className="h-4 w-4" />
              피드백
            </div>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                O(n) 접근이 좋아요.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                중복 값 케이스를 팀 리뷰에 남겨보세요.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {["최근 Accepted 확인", "다음 추천: Valid Anagram", "팀원 4명 참여"].map(
          (item) => (
            <div
              key={item}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600"
            >
              {item}
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function ExternalImagePreview({
  slide,
}: {
  slide: ImageSlide;
}) {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/90 p-3 shadow-2xl shadow-slate-900/15 backdrop-blur">
      <div
        role="img"
        aria-label={slide.title}
        className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-cover bg-center"
        style={{ backgroundImage: `url(${slide.imageUrl})` }}
      >
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 to-transparent p-5 text-white">
          <p className="text-lg font-semibold">{slide.title}</p>
          <p className="mt-1 text-sm leading-6 text-white/80">
            {slide.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function LandingHeroShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex] ?? slides[0];

  const move = (direction: -1 | 1) => {
    setActiveIndex((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <div className="mx-auto w-full max-w-[620px]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-950">
            {activeSlide.title}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {activeSlide.description}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="이전 쇼케이스 보기"
            onClick={() => move(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/85 text-slate-700 shadow-sm transition hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="다음 쇼케이스 보기"
            onClick={() => move(1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/85 text-slate-700 shadow-sm transition hover:bg-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {activeSlide.kind === "code" ? (
        <CodePreview />
      ) : (
        <ExternalImagePreview slide={activeSlide} />
      )}

      <div className="mt-4 flex justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            aria-label={`${slide.title} 보기`}
            onClick={() => setActiveIndex(index)}
            className={[
              "h-2.5 rounded-full transition",
              activeIndex === index ? "w-8 bg-blue-600" : "w-2.5 bg-slate-300",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}
