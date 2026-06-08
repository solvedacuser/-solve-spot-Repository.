"use client"

import React, { useState } from 'react';
import { useRouter } from "next/navigation"
const SUGGESTED_QUESTIONS = [
  "python 정렬 예시 보여줘",
  "React와 TypeScript 초기 세팅 방법",
  "Two sum 알고리즘 해결법",
  "도전할 알고리즘 주제에 대해 추천해줘",
];

import { Noto_Sans_KR } from 'next/font/google';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const LIGHT_BLUE_THEME = {
  border: "border-blue-100",
  iconBg: "bg-blue-50",
  iconText: "text-blue-500",
  badgeBg: "bg-blue-50",
  badgeText: "text-blue-600",
  tagBg: "bg-blue-50",
  tagText: "text-blue-600",
  buttonBg: "bg-blue-400",
  buttonHover: "hover:bg-blue-500",
};

const FEATURE_CARDS = [
  {
    id: 1,
    badge: "AI 추천",
    title: "복습 문제 추천",
    description: "오늘 다시 풀면 좋은 문제를\nAI가 추천해드려요.",
    tags: ["오답 기반", "기록 분석", "맞춤 추천"],
    buttonText: "추천 문제 보기", 
    colors: LIGHT_BLUE_THEME,
    icon: (
    <i className="fa-solid fa-book-open text-[2rem]"></i>
    )
  },
  {
    id: 2,
    badge: "AI 분석",
    title: "AI 코드 분석",
    description: "코드의 복잡도, 개선점,\n예외 케이스를 분석해드려요.",
    tags: ["복잡도 분석", "개선점 제안", "반례 탐지"],
    buttonText: "코드 분석하기",
    colors: LIGHT_BLUE_THEME,
    icon: (
    <i className="fa-solid fa-code text-[2rem]"></i>
    )
  },
  {
    id: 3,
    badge: "단계별 힌트",
    title: "힌트 단계 제공",
    description: "정답을 바로 알려주지 않고\n단계별 힌트로 도와드려요.",
    tags: ["1단계 힌트", "단계별 가이드", "스스로 해결"],
    buttonText: "힌트 요청하기", 
    colors: LIGHT_BLUE_THEME,
    icon: (
    <i className="fa-regular fa-lightbulb text-[2.3rem]"></i>
    )
  },
  {
    id: 4,
    badge: "AI 분석",
    title: "약점 태그 분석",
    description: "최근 풀이 기록으로 약한\n알고리즘 유형을 분석해드려요.",
    tags: ["약점 파악", "유형 분석", "맞춤 학습"],
    buttonText: "약점 분석하기",
    colors: LIGHT_BLUE_THEME,
    icon: (
    <i className="fa-solid fa-tag text-[2.3rem]"></i>
    )
  }
];

interface RecommendedProblem {
  id: number;
  platform: string;
  title: string;
  reason: string;
  difficulty: "Easy" | "Medium" | "Hard";
  difficultyColor: string;
  tags: string[];
  estimatedTime: string;
  solvedCount: number;
  successRate: number;
  link: string;
}

const MOCK_RECOMMENDED_PROBLEMS: RecommendedProblem[] = [
  { id: 1, platform: "LeetCode", title: "Two Sum", reason: "BFS를 활용한 최단 거리 탐색 문제입니다.", difficulty: "Medium", difficultyColor: "bg-yellow-100 text-yellow-700", tags: ["BFS", "그래프"], estimatedTime: "30분", solvedCount: 145230, successRate: 43.5, link: "https://leetcode.com/problems/two-sum/description/" },
  { id: 14502, platform: "백준", title: "연구소", reason: "이전에 성공적으로 푼 문제와 유사한 응용 형태입니다. 도전해보세요!", difficulty: "Hard", difficultyColor: "bg-red-100 text-red-700", tags: ["구현", "BFS", "브루트포스"], estimatedTime: "45분", solvedCount: 89412, successRate: 28.1, link: "https://leetcode.com/problems/two-sum/description/" },
  { id: 2606, platform: "백준", title: "바이러스", reason: "DFS 개념을 완벽히 복습하기에 가장 적합한 문제로 분석되었습니다.", difficulty: "Medium", difficultyColor: "bg-yellow-100 text-yellow-700", tags: ["그래프", "DFS"], estimatedTime: "25분", solvedCount: 201844, successRate: 51.2, link: "https://leetcode.com/problems/two-sum/description/" },
  { id: 1004, platform: "백준", title: "어린 왕자", reason: "수학적 사고력을 기르기 위해 AI가 특별히 선택한 추천 문제입니다.", difficulty: "Easy", difficultyColor: "bg-green-100 text-green-700", tags: ["수학", "기하학"], estimatedTime: "20분", solvedCount: 54320, successRate: 65.8, link: "https://leetcode.com/problems/two-sum/description/" },
];

export default function AssistantLanding() {
  const router = useRouter()
  const [inputValue, setInputValue] = useState('');
  
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [codeInputValue, setCodeInputValue] = useState('');
  const [problemInputValue, setProblemInputValue] = useState('');
  const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendedProblems, setRecommendedProblems] = useState<RecommendedProblem[]>([]);
  const [isWeaknessModalOpen, setIsWeaknessModalOpen] = useState(false);
  const [userIdInputValue, setUserIdInputValue] = useState('');

  const handleWeakness = async(userId:any) => {
    const response = await fetch("/api/v1/getSubmission", {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({id : userId})
    })
    const res = await response.json()
    const queryText = `다음은 최근 내 leetCode 문제 풀이 내역이야 해당 기록을 보고 나의 약점에 대해 알려줘 ${res.text}`
    sessionStorage.setItem("query", queryText)
    sessionStorage.setItem("queryType", "weakness")
    router.push("/helperChat")
  }

  const hintHandle = () => {
    const queryText = `지금 ${problemInputValue}라는 문제를 도전하고 있고 다음은 현재까지 내가 작성한 코드야 해당 코드를 보고 정답 대신 약간의 힌트를 제시해줘 \`\`\`code ${codeInputValue}\`\`\` `
    sessionStorage.setItem("query", queryText)
    router.push("/helperChat")
  }
  const executeSearch = (query: string) => {
    if (!query.trim()) return;
    
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sessionStorage.setItem("query", inputValue)
    router.push("/helperChat")
  };


  const handleBadgeClick = (question: string) => {
    setInputValue(question);
    executeSearch(question);
  };

  const handleCardButtonClick = async (cardId: number) => {
    if (cardId === 1) {
      setIsRecommendModalOpen(true);
      setIsRecommending(true);
      setRecommendedProblems([]); 

      const response = await fetch("/api/v1/aiRemark", {
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({})
      })
      const res = await response.json()
      console.log(res)
      setRecommendedProblems(res)
      setIsRecommending(false);
      
      
      
    } else if (cardId == 2){
        router.push("/analysis")
    } else if (cardId === 3) {
      setIsCodeModalOpen(true);
    } else if (cardId == 4){
      setIsWeaknessModalOpen(true);
    } else {
      alert(`해당 기능은 준비 중입니다. (카드 ID: ${cardId})`);
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-screen px-4 py-12 mt-5 ${notoSansKr.className}`}>
      
      <div className="text-center mb-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 tracking-tight">
          무엇을 도와드릴까요?
        </h1>
        <p className="text-gray-500 text-lg">
          궁금한 점을 입력하거나 아래 추천 질문을 선택해 보세요.
        </p>
      </div>

      
      <div className="w-full max-w-2xl mb-16">
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="여기에 질문을 입력하세요..."
            className="w-full px-6 py-4 pr-16 text-lg bg-white border-2 border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </form>

        <div className="mt-8">
          <h2 className="text-sm font-semibold text-gray-400 mb-3 ml-1 flex items-center gap-2">
            추천 질문
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {SUGGESTED_QUESTIONS.map((question, index) => (
              <button
                key={index}
                onClick={() => handleBadgeClick(question)}
                className="px-4 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl shadow-sm hover:text-blue-600 hover:border-blue-200 transition-all"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>

      
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {FEATURE_CARDS.map((card) => (
          <div 
            key={card.id} 
            className={`flex flex-col justify-between bg-white rounded-3xl border-2 ${card.colors.border} p-6 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex gap-5 mb-8">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center shrink-0 ${card.colors.iconBg} ${card.colors.iconText}`}>
                {card.icon}
              </div>
              <div className="flex flex-col pt-1">
                <div className={`w-fit px-3 py-1 rounded-full text-[13px] font-bold mb-2 flex items-center ${card.colors.badgeBg} ${card.colors.badgeText}`}>
                  {card.badge}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1.5">{card.title}</h3>
                <p className="text-gray-500 text-sm whitespace-pre-line mb-4 leading-relaxed">
                  {card.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag, idx) => (
                    <span key={idx} className={`px-3 py-1 text-[12px] font-medium rounded-full ${card.colors.tagBg} ${card.colors.tagText}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleCardButtonClick(card.id)}
              className={`w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2 transition-colors ${card.colors.buttonBg} ${card.colors.buttonHover}`}
            >
              {card.buttonText}
              <i className="fa-solid fa-angle-right"></i>
            </button>
          </div>
        ))}
      </div>

      
      {isRecommendModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col transform transition-all max-h-[90vh]">
            
            <div className="px-7 py-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                 AI 맞춤 복습 추천
              </h3>
              <button 
                onClick={() => setIsRecommendModalOpen(false)} 
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-8 bg-gray-50 overflow-y-auto">
              {isRecommending ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <svg className="animate-spin h-12 w-12 text-blue-500 mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-gray-600 text-lg font-medium animate-pulse">
                    사용자의 학습 기록을 분석하여 최적의 문제를 찾는 중입니다...
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-4">
                  {recommendedProblems.map((prob) => (
                    <div 
                      key={prob.id} 
                      className="flex flex-col bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all w-full relative group"
                    >
                     
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-sm font-bold text-blue-500 mb-0.5 tracking-tight">#{prob.id}</div>
                          <h4 className="text-lg font-bold text-gray-900 line-clamp-1">
                            {prob.title}
                          </h4>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${prob.difficultyColor}`}>
                          {prob.difficulty}
                        </span>
                      </div>

                     
                      <div className="flex flex-col gap-1.5 mb-3 bg-gray-50 p-3 rounded-xl">
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-1.5 text-gray-600">
                          <i className="fa-solid fa-user-group"></i>
                            <span className="font-medium">{prob.solvedCount.toLocaleString()}명 도전</span>
                          </div>
                          <span className="text-gray-700 font-bold">{prob.successRate}% 정답</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${prob.successRate}%` }} 
                          />
                        </div>
                      </div>

                      {/* AI 추천 이유 박스 */}
                      <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl mb-4">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-blue-600 text-xs font-bold">💡 AI 추천 노트</span>
                        </div>
                        <p className="text-[13px] text-gray-700 leading-relaxed">
                          {prob.reason}
                        </p>
                      </div>

                     
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {prob.tags.map((tag, idx) => (
                          <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg">
                            # {tag}
                          </span>
                        ))}
                      </div>

                      
                      <div className="mt-auto">
                        <div className="flex items-center gap-2 text-[13px] text-gray-500 font-medium mb-3">
                        <i className="fa-regular fa-clock"></i>
                          <span>예상 풀이 시간: <strong className="text-gray-700">{prob.estimatedTime}</strong></span>
                        </div>

                        
                        <button className="w-full py-3 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                          문제 풀기
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      
      {isCodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all">
            
            
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">💡</span> 단계별 힌트 요청
              </h3>
              <button 
                onClick={() => {
                  setIsCodeModalOpen(false);
                  setProblemInputValue(''); 
                  setCodeInputValue('');
                }} 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <i className="fa-solid fa-x"></i>
              </button>
            </div>
            
            
            <div className="p-6 bg-gray-50 flex-grow flex flex-col gap-4"> 
              
              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2 ml-1">
                  현재 도전 중인 문제
                </label>
                <input
                  type="text"
                  value={problemInputValue}
                  onChange={(e) => setProblemInputValue(e.target.value)}
                  placeholder="예: (LeetCode) Two Sum"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 shadow-sm text-sm placeholder:text-gray-400 transition-all"
                />
              </div>

              
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2 ml-1">
                  작성한 코드
                </label>
                <textarea
                  value={codeInputValue}
                  onChange={(e) => setCodeInputValue(e.target.value)}
                  placeholder="// 여기에 코드를 붙여넣으세요..."
                  className="w-full h-64 p-5 font-mono text-[14px] leading-relaxed bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 resize-none shadow-inner"
                />
              </div>
            </div>
            
            
            <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3">
              <button 
                onClick={() => {
                  setIsCodeModalOpen(false);
                  setProblemInputValue(''); 
                  setCodeInputValue('');
                }} 
                className="px-6 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button 
                onClick={() => {
                  setIsCodeModalOpen(false);
                  hintHandle(); 
                  setProblemInputValue(''); 
                  setCodeInputValue('');
                }} 
                className="px-6 py-3 rounded-xl font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm"
              >
                힌트 받기
                {/* <i className="fa-solid fa-arrow-right"></i> */}
              </button>
            </div>

          </div>
        </div>
      )}
      
      {isWeaknessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col transform transition-all">
            
            
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                
                약점 태그 분석
              </h3>
              <button 
                onClick={() => {
                  setIsWeaknessModalOpen(false);
                  setUserIdInputValue('');
                }} 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            
            <div className="p-6 bg-gray-50 flex-grow flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2 ml-1">
                  LeetCode 사용자 (LeetCode ID)
                </label>
                <input
                  type="text"
                  value={userIdInputValue}
                  onChange={(e) => setUserIdInputValue(e.target.value)}
                  placeholder="분석할 아이디를 입력해주세요"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 shadow-sm text-sm placeholder:text-gray-400 transition-all"
                />
              </div>
              <p className="text-xs text-gray-500 ml-1">
                최근 풀이 기록을 바탕으로 취약한 알고리즘 유형을 분석합니다.
              </p>
            </div>
            
            
            <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end gap-3">
              <button 
                onClick={() => {
                  setIsWeaknessModalOpen(false);
                  setUserIdInputValue('');
                }} 
                className="px-6 py-3 rounded-xl font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button 
                onClick={() => {
                  if (!userIdInputValue.trim()) {
                    alert('LeetCode 아이디를 입력해주세요.');
                    return;
                  }
                  setIsWeaknessModalOpen(false);
                  
                  handleWeakness(userIdInputValue)
                  setUserIdInputValue('');
                }} 
                className="px-6 py-3 rounded-xl font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-sm"
              >
                분석 시작
                
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}