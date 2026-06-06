"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Noto_Sans_KR } from 'next/font/google';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

type Role = 'user' | 'assistant';

interface Message {
  id: string;
  role: Role;
  content: string;
}

interface RecommendedProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
}
const MessageFormatter = ({ content, role }: { content: string; role: Role }) => {
  
  const normalizedContent = content
    .replace(/\\\\n/g, '\n')     
    .replace(/\\n/g, '\n')        
    .replace(/\\\\"/g, '"')       
    .replace(/\\"/g, '"')         
    .replace(/\\\\/g, '\\')       
    .replace(/\\\s*\n/g, '\n')    
    .replace(/\\$/gm, '')         
    .trim();                     

  
  const parts = normalizedContent.split(/(```[\s\S]*?```)/g);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className={`flex flex-col gap-2.5 w-full text-[14.5px] ${role === 'user' ? 'items-end' : 'items-start'} ${notoSansKr.className}`}>
      <link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
/>
      
      {parts.map((part, index) => {
        
        if (part.startsWith('```')) {
          
          const match = part.match(/```([a-zA-Z0-9+#-]*)\s*([\s\S]*?)```/);
          
          
          const language = match && match[1] ? match[1].toLowerCase() : 'text';
          const code = match ? match[2].trim() : part.replace(/```/g, '').trim();
          
          const displayLang = language === 'js' ? 'JavaScript' : language === 'ts' ? 'TypeScript' : language.charAt(0).toUpperCase() + language.slice(1);
          
          return (
            <div key={index} className="w-[85%] max-w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 my-1 shadow-sm">
              <div className="flex items-center justify-between px-4 pt-3 pb-1 text-gray-700 bg-gray-50">
                <div className="flex items-center gap-2">
                  
                  <i className="fa-solid fa-code"></i>
                  <span className="text-[13px] font-medium tracking-wide">{displayLang || 'Code'}</span>
                </div>
                <button 
                  onClick={() => handleCopy(code)}
                  className="p-1.5 hover:bg-gray-200 rounded-md text-gray-500 transition-colors"
                  aria-label="코드 복사"
                >
                  <i className="fa-regular fa-copy w-4 h-4 text-center"></i>
                </button>
              </div>
              <SyntaxHighlighter
                language={language === 'js' ? 'javascript' : language === 'ts' ? 'typescript' : language}
                style={prism}
                customStyle={{ margin: 0, padding: '1rem', fontSize: '0.85rem', backgroundColor: 'transparent' }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          );
        }
        
        // 일반 텍스트인 경우
        if (part.trim()) {
          return (
            <div
              key={index}
              className={`w-fit max-w-full px-5 py-3.5 shadow-sm rounded-2xl ${
                role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
              }`}
            >
              <span className="whitespace-pre-wrap leading-relaxed">{part.trim()}</span>
            </div>
          );
        }
        
        return null;
      })}
    </div>
  );
};


export default function DesktopSplitCodeChatUI() {
  const [messages, setMessages] = useState<Message[]>([]); //기존 object 형태 { id: '1', role: 'assistant', content: '안녕하세요! 왼쪽 카드에서 문제를 선택하시거나, 질문을 입력해 주세요.' }
  // console.log(messages)
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState()
  const [recommend, setRecommend] = useState<RecommendedProblem[]>()
  
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const called = useRef(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  

  const recommendedProblems: RecommendedProblem[] = [
    { id: 'p1', title: '배열의 중복 요소 제거하기', difficulty: 'Easy', category: '추천 문제 #1' },
    { id: 'p2', title: '정렬된 배열에서 이진 탐색 구현', difficulty: 'Medium', category: 'Algorithm' },
    { id: 'p3', title: 'React 커스텀 훅(useFetch) 작성', difficulty: 'Medium', category: 'React' },
  ];


    const scrollToBottom = () => {
        if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: 'smooth',
        });
        }
    };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  
  const getAnalysis = async() => {
    const analysis = sessionStorage.getItem("analysis")
    if(!analysis) return
    setData(JSON.parse(analysis))
    console.log("data : ", JSON.parse(analysis))
    
    
    
    const response = await fetch("/api/v1/gemini1", {
      method : "POST",
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({data : JSON.parse(analysis)})
    })
    if(!response.ok){
      const errorMessage = await response.json().catch(() => ({
        message: "server error"
      }))
      console.log("errorMessage : ", errorMessage)
      return errorMessage
    }
    const res = await response.json()
    let recommendList:any = []
    
    if(res && Array.isArray(res.recommend)){
      console.log("res is exist and make recommend")
      res.recommend.forEach((elem:any, idx:any) => {
        recommendList.push({ id: idx, title: elem.title, difficulty: elem.difficulty, category: `추천 문제 #${idx+1}` })
      })
      
    }
    setRecommend(recommendList)
    
    
    
    return res
  }


  useEffect(() => {
    // strict mode로 인한 useEffect 2번 실행 방지
    if(called.current) return
    called.current = true
    EnterMessage()
    
  },[])
  const EnterMessage = async () => {
   
    
    setIsLoading(true);

    try {
      
      const res = await getAnalysis()
      if (!res) {
        setIsLoading(false);
        console.log("failed to connecting ai")
        return; 
      }
      
      
      
      let aiResponseContent = res.analysis || ""
      if(!res.analysis) aiResponseContent = res.message
      
      
      // 이스케이프 기호 청소
      const normalizedContent = aiResponseContent
      .replace(/\\\\n/g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/\\\\"/g, '"')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
      .replace(/\\\s*\n/g, '\n')
      .replace(/\\$/gm, '')
      .trim();

      
      setMessages((prev) => [
      ...prev, 
      { id: 'ai-' + Date.now(), role: 'assistant', content: normalizedContent }
      ]);

    } catch (error) {
    console.error('메시지 전송 실패:', error);
    } finally {
    setIsLoading(false);
    }
  };




  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
    };
    let messageLog = messages
    messageLog.push(userMessage)
    setMessages(messageLog);
    setIsLoading(true);
    console.log(messages)
    setTimeout(() => {
        scrollToBottom();
      }, 50);
    try {
      
      const response = await fetch("/api/v1/chat", {
        method : "POST",
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({message : text, chatLog : messages})
      })
      if(!response.ok){
        const errorMessage = await response.json().catch(() => ({
          message: "server error"
        }))
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(), 
            role: 'assistant',
            content: errorMessage.message,
          }
        ]);
        console.log("sendMessgaeError : ", errorMessage)
        return
      }
      const res = await response.json()
      // console.log("response", res)
      
     
      let aiResponseContent = res.message || "sdf"
      
      
      // 이스케이프 기호 청소
      const normalizedContent = aiResponseContent
        .replace(/\\\\n/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/\\\\"/g, '"')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/\\\s*\n/g, '\n')
        .replace(/\\$/gm, '')
        .trim();

      
      setMessages((prev) => [
        ...prev, 
        { id: 'ai-' + Date.now(), role: 'assistant', content: normalizedContent }
      ]);

    } catch (error) {
      console.error('메시지 전송 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
    setInput('');
  };

  const getDifficultyColor = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-50 text-green-700 border-green-200';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Hard': return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  return (
    <div className={`flex h-screen w-full  font-sans overflow-hidden items-center justify-center p-4 md:p-8 ${notoSansKr.className}`}>
      <div className="flex flex-row gap-6 w-full max-w-[1400px] h-full max-h-[85vh]">
        
        {/* 추천 문제 섹션 */}
        <div className="hidden lg:flex flex-col w-80 bg-white rounded-[2rem] shadow-xl border border-gray-200 overflow-hidden flex-shrink-0">
          <div className="px-6 py-5 border-b border-gray-100 bg-white">
            <div className="flex items-center gap-2 text-gray-900">
              <span className="text-lg">💡</span>
              <h2 className="font-bold tracking-tight text-gray-800">추천 학습 문제</h2>
            </div>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">클릭 시 자세한 분석을 확인할 수 있습니다</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-gray-50/30">
            {/* 추천 데이터가 없을 때 보여줄 로딩 스피너 */}
            {!recommend ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={`skeleton-${idx}`}
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl flex flex-col gap-3 animate-pulse shadow-sm"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="h-2.5 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-10"></div>
                  </div>
                  <div className="flex flex-col gap-1.5 mt-0.5">
                    <div className="h-3 bg-gray-200 rounded w-11/12"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))
            ) : (
              /* 추천 문제 구성 */
              recommend.map((problem:any) => (
                <button
                  key={problem.id}
                  onClick={() => sendMessage(problem.title)}
                  disabled={isLoading}
                  className="w-full text-left p-4 bg-white border border-gray-200 hover:border-blue-400 hover:shadow-md rounded-2xl transition-all group flex flex-col gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] font-semibold text-gray-400 group-hover:text-blue-500 transition-colors">
                      {problem.category}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-gray-700 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                    {problem.title}
                  </h3>
                </button>
              ))
            )}
          </div>
        </div>

        {/* 채팅창 섹션 */}
        <div className="flex-1 bg-white rounded-[2rem] shadow-2xl border border-gray-200 flex flex-col overflow-hidden min-w-0">
          <header className="px-8 py-5 border-b border-gray-100 flex items-center gap-3 bg-white">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-lg shadow-sm"><i className="fa-solid fa-graduation-cap"></i></div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">AI 학습 도우미</h1>
              <div className="flex items-center gap-1.5 text-green-600 font-medium text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                <span>실행 중</span>
              </div>
            </div>
          </header>

          <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
            <div className="space-y-8">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                 
                  style={
                    msg.role === 'assistant' 
                      ? { animation: 'fadeIn 0.5s ease-out forwards' } 
                      : {}
                  }
                >
                  <MessageFormatter content={msg.content} role={msg.role} />
                </div>
              ))}

              
              {isLoading && (
                <div className="flex items-start gap-3.5 flex-row">
                  <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 shadow-sm"><i className="fa-solid fa-graduation-cap"></i></div>
                  <div className="flex flex-col items-start">
                    <span className="text-[11px] text-gray-400 font-medium mb-1 px-1">AI</span>
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3.5 shadow-sm flex items-center gap-1.5 w-fit h-[42px]">
                      <div className="flex space-x-1.5 items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div />
            </div>
          </div>

          <div className="p-6 bg-white border-t border-gray-100">
            <form onSubmit={handleSubmit} className="relative flex items-end shadow-sm border border-gray-200 rounded-2xl bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all focus-within:bg-white">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                placeholder="질문을 입력하세요..."
                className="flex-1 max-h-36 px-5 py-3.5 bg-transparent resize-none outline-none disabled:cursor-not-allowed rounded-2xl text-gray-800 placeholder:text-gray-400 text-sm"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <div className="p-2">
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}