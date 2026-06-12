"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Noto_Sans_KR } from "next/font/google";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function CodeDiagnosisForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    language: "",
    severity: "",
    environment: "",
    isSolved: "unsolved",
    errorType: "",
    description: "",
    errorMessage: "",
    expectedReason: "",
    code: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSeveritySelect = (level: string) => {
    setFormData((prev) => ({ ...prev, severity: level }));
  };

  const handleSolvedSelect = (status: "solved" | "unsolved") => {
    setFormData((prev) => ({ ...prev, isSolved: status }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);

    if (!formData.title.trim()) {
      alert("문제 제목을 입력해 주세요.");
      return; // 폼 제출 중단
    }

    if (!formData.language) {
      alert("프로그래밍 언어를 선택해 주세요.");
      return;
    }

    if (!formData.code.trim()) {
      alert("진단이 필요한 소스 코드를 입력해 주세요.");
      return;
    }

    sessionStorage.setItem("analysis", JSON.stringify(formData));
    console.log("Submitted Data:", formData);
    alert("성공적으로 제출되었습니다!");
    router.push("/aiAnalysis");
  };

  return (
    <div
      className={`min-h-screen py-10 px-4 antialiased text-gray-800 ${notoSansKr.className}`}
    >
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <span className="inline-block bg-[#EEF2FF] text-[#4F46E5] text-xs font-bold px-2.5 py-1 rounded-md mb-4 tracking-wide">
            CODE DIAGNOSIS
          </span>
          <h1 className="text-2xl font-bold mb-2">AI 분석 서비스</h1>
          <p className="text-gray-500 text-sm mb-6">
            질의에 관련한 코드와 상세 정보를 입력하면 정확한 분석 및 향후 학습
            지도를 도와드립니다.
          </p>
          <div className="h-[2px] bg-black w-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#FAFAFA] border border-gray-200 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#EEF2FF] text-[#4F46E5] text-sm font-bold px-2 py-0.5 rounded">
                01
              </span>
              <h2 className="text-[17px] font-bold">기본 정보</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">
                  문제 제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="예: Two Sum"
                  maxLength={120}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                />
                <div className="text-right text-xs text-gray-400 mt-1.5 font-medium">
                  {formData.title.length} / 120
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">
                    프로그래밍 언어 <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white appearance-none"
                  >
                    <option value="" disabled>
                      언어 선택
                    </option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">
                    심각도
                  </label>
                  <div className="flex gap-2">
                    {["낮음", "중간", "높음"].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => handleSeveritySelect(level)}
                        className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                          formData.severity === level
                            ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                            : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">
                  실행 환경
                </label>
                <input
                  type="text"
                  name="environment"
                  value={formData.environment}
                  onChange={handleChange}
                  placeholder="예: Node.js 20 / macOS 14 / Chrome 124"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="pt-2">
                <label className="block text-[13px] font-bold text-gray-700 mb-2 text-left">
                  문제 해결 여부 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3 w-full">
                  <button
                    type="button"
                    onClick={() => handleSolvedSelect("solved")}
                    className={`flex-1 py-3 text-sm font-medium transition-colors border rounded-lg ${
                      formData.isSolved === "solved"
                        ? "border-green-500 bg-green-50 text-green-700 font-bold"
                        : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    해결 (Accepted)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSolvedSelect("unsolved")}
                    className={`flex-1 py-3 text-sm font-medium transition-colors border rounded-lg ${
                      formData.isSolved === "unsolved"
                        ? "border-red-500 bg-red-50 text-red-700 font-bold"
                        : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    미해결 (Not Accepted)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#FAFAFA] border border-gray-200 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#EEF2FF] text-[#4F46E5] text-sm font-bold px-2 py-0.5 rounded">
                02
              </span>
              <h2 className="text-[17px] font-bold">문제 설명</h2>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2">
                질문 / 현상 설명
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="어떤 상황에서 문제가 발생하는지, 어떤 오류가 나타나는지 설명해 주세요."
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white resize-none"
              />
            </div>
          </div>

          {formData.isSolved === "unsolved" && (
            <div className="bg-[#FAFAFA] border border-red-200/60 rounded-xl p-8 animate-fadeIn">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-red-50 text-red-600 text-sm font-bold px-2 py-0.5 rounded">
                  03
                </span>
                <h2 className="text-[17px] font-bold text-gray-900">
                  오류 정보
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">
                    오류 유형
                  </label>
                  <select
                    name="errorType"
                    value={formData.errorType}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white appearance-none"
                  >
                    <option value="">유형 선택 (선택사항)</option>
                    <option value="syntax">Syntax Error (문법 오류)</option>
                    <option value="runtime">Runtime Error (런타임 오류)</option>
                    <option value="logic">Logical Error (논리 오류)</option>
                    <option value="performance">
                      Performance Issue (성능 문제)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">
                    오류 메시지 (에러 로그)
                  </label>
                  <textarea
                    name="errorMessage"
                    value={formData.errorMessage}
                    onChange={handleChange}
                    placeholder="콘솔이나 터미널에 출력된 에러 메시지를 있는 그대로 복사해 주세요."
                    rows={4}
                    // ✨ placeholder:font-sans 만 추가 (기본 placeholder 스타일 유지)
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-gray-700 mb-2">
                    본인이 예상하는 원인 (선택사항)
                  </label>
                  <textarea
                    name="expectedReason"
                    value={formData.expectedReason}
                    onChange={handleChange}
                    placeholder="문제가 발생한다고 생각하는 의심 부위나 원인이 있다면 적어주세요."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="bg-[#FAFAFA] border border-gray-200 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#EEF2FF] text-[#4F46E5] text-sm font-bold px-2 py-0.5 rounded">
                {formData.isSolved === "unsolved" ? "04" : "03"}
              </span>
              <h2 className="text-[17px] font-bold">코드 작성</h2>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 mb-2">
                소스 코드 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="진단이 필요한 코드를 이곳에 붙여넣어 주세요."
                rows={12}
                className="w-full border border-gray-300 rounded-lg px-4 py-4 text-[13px] font-mono placeholder:font-sans placeholder:text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white text-gray-800 resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold py-3.5 px-8 rounded-lg transition-colors shadow-sm text-sm"
            >
              진단 요청하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
