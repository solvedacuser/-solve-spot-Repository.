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
    <div className={`flex flex-col gap-2.5 w-full text-[14.5px] ${role === 'user' ? 'items-end' : 'items-start'}`}>
      <link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
/>
      
      {parts.map((part, index) => {
        // 코드 블록인 경우
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
        
        // 일반 텍스트 블록인 경우
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

interface AiLog {
  id: string;
  messageId: string;
  message: string;
  status: 'success' | 'loading' | 'error';
}

export default function DesktopSplitCodeChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  // console.log(messages)
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState()
  const [recommend, setRecommend] = useState<RecommendedProblem[]>()
  const [aiAnalysis, setAiAnalysis] = useState()
  const [aiLogs, setAiLogs] = useState<AiLog[]>([]);
  const scrollToMessage = (messageId: string) => {
    const element = document.getElementById(`message-${messageId}`);
    const container = document.getElementById('chat-container');
    if (element && container) {
      
      container.scrollTo({
              top: element.offsetTop - 24,
               behavior: 'smooth'
             });
    }
  };
  
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const called = useRef(false)
  

  const recommendedProblems: RecommendedProblem[] = [
    { id: 'p1', title: '배열의 중복 요소 제거하기', difficulty: 'Easy', category: '추천 문제 #1' },
    { id: 'p2', title: '정렬된 배열에서 이진 탐색 구현', difficulty: 'Medium', category: 'Algorithm' },
    { id: 'p3', title: 'React 커스텀 훅(useFetch) 작성', difficulty: 'Medium', category: 'React' },
  ];

  const scrollToBottom = () => {
    const container = document.getElementById('chat-container');
    if (container) {
      
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  
  


  useEffect(() => {
    // strict mode로 인한 useEffect 2번 실행 방지
    if(called.current) return
    called.current = true
    EnterMessage()
    
  },[])
  
  const EnterMessage = async () => {
    let query = sessionStorage.getItem("query")
    const queryType = sessionStorage.getItem("queryType") || null
    let weaknessQuery 
    if(queryType == "weakness"){
      console.log("here")
      weaknessQuery = query
      query = "현재 나의 약점을 분석해줘"
    }
    console.log("weaknessQuery : ", weaknessQuery)
    console.log("query : ", query)
    let messageLog = messages
    messageLog.push({ id: '0', role: 'user', content: query ? query : "" })
    sessionStorage.removeItem("query");
    sessionStorage.removeItem("queryType");
    setMessages(messageLog)
    setIsLoading(true);

    try {
      
      const response = await fetch("/api/v1/chat", {
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify({chatLog : queryType=="weakness" ? [{ id: '0-1', role: 'user', content: weaknessQuery }] : messages})
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
        return
      }
      
      const res = await response.json()
      if (!res) {
        setIsLoading(false);
        console.log("failed to connecting ai")
        return; 
      }
      
      
      
      let aiResponseContent = res.message || "잠시 후 다시 시도해주세요";
      
      
      const normalizedContent = aiResponseContent
        .replace(/\\\\n/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/\\\\"/g, '"')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/\\\s*\n/g, '\n')
        .replace(/\\$/gm, '')
        .trim();

        const newAiMsgId = 'ai-' + Date.now();
      
      setMessages((prev) => [
        ...prev, 
        { id: newAiMsgId, role: 'assistant', content: normalizedContent }
      ]);
      
      setAiLogs((prev) => [
        { 
          id: 'log-' + Date.now(), 
          messageId: newAiMsgId, 
          message: query && query.length > 10 ? `'${query?.substring(0, 10)}...' 분석 완료` : `'${query}' 분석 완료`,
          status: 'success' 
        },
        ...prev
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
    sessionStorage.removeItem("query");
    setMessages(messageLog)
    console.log(messages)
    setIsLoading(true);
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
        return
      }
      const res = await response.json()
      
      let aiResponseContent = res.message || "잠시 후 다시 시도해주세요";
      
      
      const normalizedContent = aiResponseContent
        .replace(/\\\\n/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/\\\\"/g, '"')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\')
        .replace(/\\\s*\n/g, '\n')
        .replace(/\\$/gm, '')
        .trim();
        const newAiMsgId = 'ai-' + Date.now();
     
      setMessages((prev) => [
        ...prev, 
        { id: newAiMsgId, role: 'assistant', content: normalizedContent }
      ]);
      
      setAiLogs((prev) => [
        { 
          id: 'log-' + Date.now(), 
          messageId: newAiMsgId, 
          
          message: text.length > 10 ? `'${text.substring(0, 10)}...' 분석 완료` : `'${text}' 분석 완료`,
          status: 'success' 
        },
        ...prev
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
    <div className={`flex h-screen w-full font-sans overflow-hidden items-center justify-center p-4 md:p-8 ${notoSansKr.className}`}>
      <div className="flex flex-row gap-6 w-full max-w-[1400px] h-full max-h-[85vh]">
        
        
        <div className="hidden lg:flex flex-col w-80 bg-white rounded-[2rem] shadow-xl border border-gray-200 overflow-hidden flex-shrink-0">
          
          <div className="px-6 pt-6 pb-2 bg-white z-10">
            <div className="flex items-center gap-2 text-gray-900">
              
              <h2 className="font-bold tracking-tight text-gray-800">활동 대시보드</h2>
            </div>
            <p className="text-[11px] text-gray-400 font-medium mt-1">실시간으로 활동 현황 로그를 확인하세요</p>
          </div>
          
          <div className="flex-1 overflow-y-auto px-4 pb-4 bg-white flex flex-col">
            <div className="flex flex-col h-full px-2 mt-2">
            {aiLogs.length === 0 ? (
                  <div className="text-center py-10 flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                      <i className="fa-solid fa-inbox"></i>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">활동 기록이 없습니다</span>
                  </div>
                ) : (
                  <div className="relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-gray-100 ml-1">
                    {aiLogs.map((log) => (
                      <button 
                        key={log.id} 
                        onClick={() => scrollToMessage(log.messageId)}
                        className="relative flex items-center gap-3.5 py-3 pl-0 pr-2 transition-all text-left w-full group hover:bg-gray-50 rounded-xl"
                      >
                        <div className="relative z-10 flex-shrink-0 w-6 h-6 rounded-full border-[3px] border-white bg-white flex items-center justify-center shadow-sm">
                          <div className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-blue-500' : 'bg-amber-400 animate-pulse'}`}></div>
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider mb-0.5 text-gray-400 group-hover:text-blue-500 transition-colors">
                            {log.status === 'success' ? 'Completed' : 'Processing'}
                          </span>
                          <span className="text-[11.5px] font-medium text-gray-600 truncate group-hover:text-gray-900 transition-colors">
                            {log.message}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
            </div>
          </div>

         
          <div className="px-6 py-6 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-2 mb-4 px-1">
                <div className="h-[1px] flex-1 bg-gray-100"></div>
                <h3 className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] whitespace-nowrap">Quick Start</h3>
                <div className="h-[1px] flex-1 bg-gray-100"></div>
            </div>
            <div className="flex flex-col gap-2.5">
              
              {[
                { label: 'Code Review', icon: 'fa-magnifying-glass-chart', prompt: '현재 내 코드에 대한 리뷰를 구성해줘', color: 'blue' },
                { label: 'Performance', icon: 'fa-gauge-high', prompt: '현재 내 코드의 성능 최적화 방안을 알려줘', color: 'purple' },
                { label: 'Bug Detection', icon: 'fa-bug', prompt: '현재 내 코드에서 발생할 수 있는 버그를 찾아줘', color: 'red' }
              ].map((item) => (
                <button 
                  key={item.label}
                  onClick={() => sendMessage(item.prompt)}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 hover:border-gray-300 rounded-2xl transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] group active:scale-[0.98] disabled:opacity-50"
                >
                  <div className={`w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-xs text-gray-500 group-hover:bg-${item.color}-50 group-hover:text-${item.color}-600 transition-colors`}>
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>
                  <span className="flex-1 text-[12px] font-bold text-gray-600 group-hover:text-gray-900 text-left">
                    {item.label}
                  </span>
                  <i className="fa-solid fa-chevron-right text-[10px] text-gray-300 group-hover:text-gray-500 transition-all"></i>
                </button>
              ))}
            </div>
          </div>
        </div>

        
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

          <div id="chat-container" className="flex-1 overflow-y-auto p-6 bg-gray-50/30 relative scroll-smooth">
            <div className="space-y-8">
              {messages.map((msg) => (
                
                <div key={msg.id} id={`message-${msg.id}`} style={
                      msg.role === 'assistant' 
                        ? { animation: 'fadeIn 0.8s ease-out forwards' } 
                        : {}
                     }>
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
              <div ref={messagesEndRef} />
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
                  <i className="w-5 h-2 pr-0.5 fa-solid fa-paper-plane justify-center text-center"></i>
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}