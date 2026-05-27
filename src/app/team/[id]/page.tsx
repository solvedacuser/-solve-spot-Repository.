"use client"

import { act, useEffect, useState } from 'react';
// import { toast } from "sonner"
import { 
  Calendar, Settings, Sparkles, ExternalLink, 
  Users, RefreshCcw, UserPlus, MoreVertical, 
  Trophy, ChevronRight, X, Search, Loader2 , Check, Play
} from 'lucide-react';

import { Noto_Sans_KR } from 'next/font/google';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

import { useParams } from 'next/navigation'
import { createClient } from "@/utils/supabase/client"
import { Session } from "@supabase/supabase-js";

const getCellColor = (value :any) => {
  if(value >= 3) return 'bg-[#4CAF50] text-white';
  else if(value >= 2) return 'bg-[#81C784] text-white';
  else if(value >= 1) return 'bg-[#C8E6C9] text-gray-700';
  else return 'bg-gray-200 text-gray-500';
};
let days = ['일', '월', '화', '수', '목', '금', '토']

function TeamProgress({ data } : {data : any[]}){
    return(
        <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4 pb-[15px] border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500 text-[13px]">
                    <i className="fa-solid fa-bars-progress" />
                  </div>
                  <span className="text-[15px] font-bold text-gray-900">문제별 진행 현황</span>
                </div>
              </div>

              {/* 문제별 진행 현황 데이터가 없을 때의 Empty State */}
              {data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                    <i className="fa-solid fa-folder-open text-sm"></i>
                  </div>
                  <p className="text-gray-600 font-semibold text-sm">진행 중인 문제가 없습니다.</p>
                  <p className="text-gray-400 text-xs mt-1">오늘의 미션 문제를 해결하고 현황을 공유해보세요!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {data.map((prob:any) => {
                    const progressRatio = Math.round((prob.solvedCount / prob.totalCount) * 100);
                    
                    return (
                      <div key={prob.id} className="border border-gray-200 rounded-xl p-4 transition-colors hover:border-indigo-200">
                        {/* 문제 제목 및 진행률 바 */}
                        <div className="flex flex-col gap-2 mb-4">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-gray-500">{prob.number}</span>
                              <span className="font-bold text-[15px] text-gray-800">{prob.title}</span>
                            </div>
                            <span className="text-xs font-bold text-[#059669] bg-[#ecfdf5] px-2.5 py-1 rounded-full">
                              완료 {progressRatio}%
                            </span>
                          </div>
                          {/* 진행률 바 */}
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mt-1">
                            <div 
                              className="h-full bg-[#48db4e] rounded-full transition-all duration-500"
                              style={{ width: `${progressRatio}%` }}
                            />
                          </div>
                        </div>

                        {/* 팀원별 상태 */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                          {prob.members.map((member:any) => (
                            <div 
                              key={member.id} 
                              className={`flex items-center gap-2.5 p-2 rounded-lg border transition-all
                                ${member.status === 'completed' 
                                  ? 'border-green-200 bg-green-50/50' 
                                  : member.status === 'working' 
                                    ? 'border-orange-200 bg-orange-50/50' 
                                    : 'border-gray-100 bg-gray-50'}`}
                            >
                              <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shadow-sm
                                ${member.isMe ? 'bg-blue-600 ring-2 ring-blue-100' : 'bg-gray-400'}`}>
                                {member.id}
                              </div>
                              <div className="flex flex-col overflow-hidden">
                                <span className="text-[12px] font-semibold text-gray-700 truncate">{member.name}</span>
                                <div className="flex items-center gap-1 mt-0.5">
                                  {member.status === 'completed' && <i className="fa-solid fa-check text-[9px] text-green-600" />}
                                  {member.status === 'working' && <i className="fa-solid fa-pen text-[9px] text-orange-500" />}
                                  {member.status === 'pending' && <i className="fa-solid fa-minus text-[9px] text-gray-400" />}
                                  <span className={`text-[10px] font-medium leading-none
                                    ${member.status === 'completed' ? 'text-green-600' 
                                      : member.status === 'working' ? 'text-orange-500' 
                                      : 'text-gray-400'}`}>
                                    {member.status === 'completed' ? '해결' : member.status === 'working' ? '풀이중' : '미시작'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
        </section>
    )
}




export default function AlgorithmDashboard() {
    const params = useParams() 
    const teamId = params.id
    // console.log("teamId ", teamId)
    const [supabase] = useState(() => createClient()) 
    const [teamInfo, setTeamInfo] = useState<any>('')
    const [teamMembers, setTeamMembers] = useState<any>([])
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState('')
    useEffect(() => {
        const getSession = async() => {
            const {data} = await supabase.auth.getSession()
            setSession(data.session)
            console.log(data.session?.user.user_metadata.boj_handle)
            setUser(data.session?.user.user_metadata.boj_handle)
        }
        getSession()
    },[])
    useEffect(() => {
        const getTeamInfo = async() => {
            let { data, error } = await supabase
                .from('team')
                .select("*")
                .eq('rid', teamId)
                .single()
            setTeamInfo(data ?? null)
            let members = []
            members.push({name : data.teamLeader, suffix : '', email : data.teamLeader + "@gmail.com", initial : data.teamLeader[0].toUpperCase(), role : '팀장', isMe: true })
            data.UserList.forEach((elem:any) => {
              members.push({name : elem.user_id, suffix : '', email : elem.leetcodeId, initial : elem.user_id[0].toUpperCase(), role : '', isMe: false })
            })
            setTeamMembers(members)
              console.log("team", data.UserList)
        }
        getTeamInfo()
        
    },[teamId])
    
    // console.log("teaminfo ", JSON.parse(teamInfo?.UserList?.[0]).rid)
    const [dates, setDates] = useState<any>([])
    useEffect(() => {
      let dateData = []
      for(let i = 6 ; i >= 0 ; i--){
        const date = new Date()
        date.setDate(date.getDate() - i)
        const krDate = new Date(date.toLocaleDateString("en-US", {timeZone :"Asia/Seoul"}))
        
        let dateFormat = krDate.toLocaleDateString("sv-SE")
        
        dateData.push({day : dateFormat.slice(8,10), label : i == 0 ? "(오늘)" : days[date.getDay()]})
        
      }
      setDates(dateData)
      
    },[])
    
    const [activity, setActivity] = useState<any>([])
    useEffect(() => {
      
      const getActivity = async() => {
        if(!teamInfo) return
        const today = new Date()
        let week = new Date()
        week.setDate(today.getDate() - 6)
        week.setHours(0, 0, 0, 0)

        let { data: problems, error } = await supabase
        .from('problems')
        .select('*')
        .eq('teamId', teamId)
        .gte("created_at", week.toISOString())
        if(!problems) return 
        
        
        let activities:any = {}
        activities[teamInfo.teamLeader] = [0,0,0,0,0,0,0]
        teamInfo.UserList.forEach((elem:any) => {
          activities[elem.user_id] = [0,0,0,0,0,0,0]
        })
        problems.forEach((elem:any) => {
          
          const dateSeries = new Date(new Date(elem.created_at).toLocaleDateString("en-US", {timeZone : "Asia/Seoul"}))
          const today = new Date()
          
          const diff = today.getTime() - dateSeries.getTime()
          const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24))
          if(diffDays >= 0 && diffDays < 7){
            const idx = 6 - diffDays
            activities[elem.user_id][idx]++
          } 
        
          
        })
        
        console.log(activities)
        let datas:any = []
        Object.entries(activities).forEach(([userId, data], idx) => {
        
        datas.push({name : userId, initial : userId[0].toUpperCase(), isMe : user == userId ? true : false, records : data})
      })
      setActivity(datas)
      // console.log("activity", activity)
        
      }
      getActivity()
      
      
      
     
    },[teamInfo])
    
    // 모달 관리를 위한 State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [problemCount, setProblemCount] = useState(3);
    const [difficulty, setDifficulty] = useState('보통');
    const [tagInput, setTagInput] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [missionInfo, setMissionInfo] = useState<any>(null)
    const [isLoadingMissions, setIsLoadingMissions] = useState(false);

    // === 이미지 UI 매칭을 위한 신규 상태 추가 ===
    const [isAutoRecommend, setIsAutoRecommend] = useState(true);
    const [selectedDays, setSelectedDays] = useState<string[]>(['월', '화', '수', '목', '금']);

    // 미션 리스트를 상태로 관리하여 상태 변경 시 리렌더링되게 합니다.
    const [missionList, setMissionList] = useState<any[]>([]);
    // 현재 로딩 중인 미션의 ID를 저장합니다. (여러 개 동시 클릭 대비 배열로 관리)
    const [loadingIds, setLoadingIds] = useState<number[]>([]);
    const [verifyDate, setVerifyDate] = useState()
    const [participant, setParticipant] = useState<any[]>([])
    const [infoTags, setInfoTags] = useState<any[]>([])
    useEffect(() => {
        const getMissionInfo = async() => {
            let { data, error } = await supabase
                .from('teamMission')
                .select("*")
                .eq('teamId', teamId)
                .order("created_At", { ascending: false })
            // console.log("sdf", data)
            setMissionInfo(data ?? [])
            setMissionList(data?.[0]?.missions || [])
            setVerifyDate(data?.[0]?.created_At || null)
            console.log("mission info", data?.[0]?.missions)
            
            // console.log("tags", tagSeries)
            // console.log()
        }
        getMissionInfo()
    },[teamId])

    useEffect(() => {
     
      if(!teamInfo || !teamInfo.UserList || !missionList) return 
      const participants = missionList.map((mission) => {
        const solved = mission.solved || []
        

        const solver = teamInfo.UserList.map((elem:any) => {
          
          const isSolved = solved.includes(elem.user_id)
          return {
            id : elem.user_id ? elem.user_id[0].toUpperCase() : "A",
            name : elem.user_id,
            status : isSolved ? 'completed' : 'working',
            isMe :  false
          }
        })
        solver.push({
          id : teamInfo.teamLeader[0].toUpperCase(),
          name : teamInfo.teamLeader,
          status : solved.includes(teamInfo.teamLeader) ? 'completed' : 'working',
          isMe : false
        })

        return {
          id : mission.id,
          title : mission.title,
          number : mission.problemNum,
          solvedCount : solved.length,
          totalCount : teamInfo.UserList.length+1,
          members : solver
        }
      })
      

      setParticipant(participants)
      console.log("participants" , participants)

      let tagSeries:any = []
            missionList.forEach((elem:any) => {
              for(let tag of elem.tags){
                if(!tagSeries.includes(tag)) tagSeries.push(tag)
              }
            })
            setInfoTags(tagSeries)
    },[missionList, teamInfo])
    
    const getRecommend = async() => {
      setIsLoadingMissions(true);
        const response = await fetch("/api/v1/recommends", {
            method: 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({diff : difficulty, count : problemCount, tags : selectedTags})
        })
        const res = await response.json()
        if(res == null){
          //toaster 생성
        //   toast.warning("스터디 생성 실패: 해당하는 문제를 찾을 수 없습니다" , { position: "bottom-right" } )
          return
        }

        console.log(res)
        
        const { data, error } = await supabase
          .from('teamMission')
          .insert([
            { missions: res, teamId: teamId, difficulty : difficulty == "쉬움" ? "Easy" : difficulty == "보통" ? "Medium" : "Hard"},
          ])
          .select()
        if(!error){
        //   toast.warning("스터디 생성 성공" , { position: "bottom-right" } )
          setMissionInfo(data)
          console.log("missioninfo", missionInfo)
          setMissionList(data[0].missions)
          setVerifyDate(data[0].created_At)
          setIsLoadingMissions(false);
        }
        else{
          alert("recommend error")
          setIsLoadingMissions(false);
        }
    }

    // 더미 태그 데이터 
    const availableTags = [
        '다이나믹 프로그래밍', '그래프 이론', '그리디 알고리즘', '정렬', 
        'DFS', 'BFS', '이진 탐색', '문자열', '해시', '트리', '최단 경로', '스택'
    ];


    // 태그 검색 필터링
    const filteredTags = availableTags.filter(tag => 
        tag.toLowerCase().includes(tagInput.toLowerCase()) && !selectedTags.includes(tag)
    );

    const handleAddTag = (tag: any) => {
        setSelectedTags([...selectedTags, tag]);
        setTagInput('');
    };

    const handleRemoveTag = (tagToRemove: any) => {
        setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
    };

    // 요일 토글 핸들러
    const handleToggleDay = (day: string) => {
        if (selectedDays.includes(day)) {
        setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
        setSelectedDays([...selectedDays, day]);
        }
    };

    // let user = "chcl77"
    const isTeamMember = teamInfo?.teamLeader === user || teamInfo?.UserList?.some((member: any) => member.user_id === user);
    
  // === Verify 연결 ===
  const handleVerifyClick = async(id: number, titleSlug:string) => {
    setLoadingIds((prev) => [...prev, id]);
    const response = await fetch("/api/v1/verify", {
      method : 'POST',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({title : titleSlug, user : user, missionList : missionList, created_At : verifyDate, teamId : teamId})
    })
    const res = await response.json()
    console.log("status", res.status)
    console.log("data" , res.data)
    if(res.status){
      // toast 성공
    //   toast.warning("검증 성공" , { position: "bottom-right" } )
      setMissionInfo(res.data)
      setMissionList(res.data[0].missions)
      setVerifyDate(res.data[0].created_At)
    }
    else{
      // toast 실패
    }
    setLoadingIds((prev) => prev.filter((loadingId) => loadingId !== id));
    
  };
  
  return (
    // bg-[#F9FAFB] 제거
    <div className={`min-h-screen p-8 text-gray-800 relative ${notoSansKr.className}`}>  
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />

      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* 헤더 영역 */}
        <header className="flex justify-between items-end border-b pb-4 border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{teamInfo.teamName}</h1>
              {/* <span className="bg-[#ecfdf5] text-[#059669] text-xs px-2 py-0.5 rounded font-semibold">활성화</span> */}
            </div>
            <p className="text-gray-500 text-sm">{teamInfo.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors">
              <UserPlus size={16} />
              멤버 초대
            </button>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical size={20} />
            </button>
          </div>
        </header>

        {/* 메인 그리드 레이아웃 구성 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 좌측 영역 */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 미션 section */}
            <section className="bg-white rounded-xl border border-blue-100 p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-[15px]">
                <div className="flex items-center gap-2 text-blue-600">
                    <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-[#4F6EF7] text-[13px]">
                        <i className="fa-solid fa-calendar-day" />
                    </div>
                  <span className="text-[15px] font-semibold text-gray-900">오늘의 미션</span>
                  <span className="text-blue-600 text-[15px] font-semibold">· {missionList.length}개</span>
                  <span className="text-gray-400 text-xs ml-2">팀장을 통해 문제 추천</span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="flex items-center gap-1 text-xs border border-gray-200 bg-white px-2 py-1.5 rounded hover:bg-gray-100 transition-colors text-gray-600"
                  >
                    <i className="fa-solid fa-arrows-rotate"></i> 스터디 생성 / 초기화
                  </button>
                </div>
              </div>
              
              {isLoadingMissions ? (
                // 로딩 스피너 UI
                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-blue-100 rounded-xl bg-blue-50/5">
                  <Loader2 className="w-9 h-9 animate-spin text-blue-500 mb-3" />
                  <p className="text-gray-500 font-medium text-sm">추천 문제를 구성하는 중입니다...</p>
                </div>
              ) : missionList.length === 0 ? (
                // 로딩은 끝났으나 오늘 생성된 미션이 없을 때
                <div className="flex flex-col items-center justify-center py-14 text-center border border-dashed border-blue-200 rounded-xl bg-blue-50/10">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-3">
                  <i className="fa-solid fa-list-check"></i>
                  </div>
                  <p className="text-gray-600 font-semibold text-sm">오늘 추천된 미션이 없습니다.</p>
                  <p className="text-gray-400 text-xs mt-1">상단의 '새로운 스터디 생성' 버튼을 눌러 난이도와 태그를 설정해보세요.</p>
                </div>
              ) : (
                /* 미션 카드들 */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {missionList.map((mission, idx) => {
                    // 현재 미션의 로딩 상태 확인
                    const isLoading = loadingIds.includes(mission.id);
                    // let isCompleted = mission.status === 'completed';
                    let isCompleted = mission.solved.includes(user)

                    return (
                      <div key={mission.id} className="flex flex-col gap-3 h-full">
                        <div className="border border-gray-200 rounded-lg p-4 flex flex-col flex-1 bg-white hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-center mb-3">
                            <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded font-bold">{idx + 1}</span>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <span className={`${isCompleted ? 'text-green-500' : ''} flex items-center gap-1 mr-[5px]`}>
                                {/* <i className="fa-solid fa-arrows-rotate"></i> 20:00 */}
                              </span>
                              <a href={mission.link} target='_blank'>
                              <button className="bg-none border-none cursor-pointer text-gray-400 text-xs p-0.5 shrink-0 transition-colors duration-150 hover:text-[#4F6EF7]" title="문제 보기">
                                <i className="fa-solid fa-arrow-up-right-from-square" />
                              </button>
                              </a>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2 mb-4"> {/*item-center */}
                            <div className={`w-5 h-5 mt-0.5 rounded-sm flex items-center justify-center text-[10px] font-bold text-white bg-[#0087ff] `}> {/*no mt */}
                              <i className="fa-solid fa-code"></i>
                            </div>
                            <h3 className="font-bold text-[15px] flex-1 line-clamp-2 break-keep leading-tight">{mission.title}</h3>{/*after text truncate */}
                          </div>

                          <div className="flex flex-wrap gap-[5px] mb-4">
                            {mission.tags?.slice(0,2).map((tag:any) => (
                              <span
                                key={tag}
                                className="px-[9px] py-0.5 rounded-full text-[11px] font-semibold bg-[#eff6ff] text-[#2563eb]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="mt-auto">
                            <div className="h-px bg-gray-200 w-full mb-3"></div>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><Users size={12} /> {mission.users}</span>
                              <span className="flex items-center gap-1"><RefreshCcw size={12} />{mission.ratio}</span>
                              <span className="text-blue-500 font-medium ml-auto">{mission.problemNum}</span>
                            </div>
                          </div>
                        </div>

                        {/* 인증 버튼 로직 적용 */}
                        {isTeamMember && (
                          <button 
                            onClick={() => !isCompleted && !isLoading && handleVerifyClick(mission.id, mission.titleSlug)}
                            disabled={isCompleted || isLoading}
                            className={`w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm
                            ${isCompleted 
                              ? 'bg-[#4CAF50] text-white cursor-default' 
                              : isLoading 
                                ? 'bg-blue-400 text-white cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'}`}>
                              
                              {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <i className="far fa-check-circle"></i>
                              )}
                              
                              {isLoading ? '인증 진행 중...' : isCompleted ? '해결 완료' : '해결 인증하기'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
            
            <TeamProgress data={participant}/>

            {/* 팀 활동 잔디 */}
            <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Users size={18} className="text-blue-600" />
                <span className="font-bold">팀 활동</span>
              </div>

              {/* 탭 구성 */}
              <div className="flex border-b border-gray-200 mb-4">
                <button className="pb-2 px-4 border-b-2 border-blue-500 text-blue-600 font-bold text-sm">
                  참여 현황
                </button>
                
              </div>

              {/* 필터 구성 */}
              <div className="flex justify-between items-end mb-2">
                <div className="flex gap-2 text-xs text-gray-500">
                  <span className="mr-2">최근</span>
                  <button className="text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">7일</button>
                  {/* <button className="hover:bg-gray-50 px-2 py-1 rounded">30일</button> */}
                </div>
              </div>

              {/* 잔디 table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-center border-collapse">
                  <thead>
                    <tr className="text-gray-400 text-xs">
                      <th className="font-normal text-left pb-2 w-32"></th>
                      {dates.map((date:any, i:any) => (
                        <th key={i} className="font-normal pb-2 px-1 w-16">
                          <div className="flex flex-col items-center">
                            <span>{date.day}</span>
                            <span>{date.label}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activity.map((record:any, i:any) => (
                      <tr key={i}>
                        <td className="py-1 pr-4 text-left">
                          <div className={`flex items-center gap-2 p-1.5 rounded-md ${record.isMe ? 'bg-blue-50/50' : ''}`}>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${record.isMe ? 'bg-blue-500' : 'bg-gray-400'}`}>
                              {record.initial}
                            </div>
                            <span className="text-gray-700 font-medium text-xs truncate max-w-[100px]">{record.name}</span>
                          </div>
                        </td>
                        {record.records.map((val:any, j:any) => (
                          <td key={j} className="p-1">
                            <div className={`w-full h-8 flex items-center justify-center rounded-sm text-xs font-medium ${getCellColor(val)}`}>
                              {val}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 세부 설명 */}
              <div className="flex items-center gap-2 mt-6 text-xs text-gray-400">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-gray-200 rounded-[3px]"></div>
                  <div className="w-3 h-3 bg-[#86efac] rounded-[3px]"></div>
                  <div className="w-3 h-3 bg-[#22c55e] rounded-[3px]"></div>
                  <div className="w-3 h-3 bg-[#15803d] rounded-[3px]"></div>
                </div>
                <span>More</span>
                <span className="mx-2">|</span>
                <div className="w-3 h-3 bg-gray-100 border border-gray-200 border-dashed rounded-[3px]"></div>
                <span>추천없음</span>
              </div>
            </section>
          </div>

          {/* 우측 영역 */}
          <div className="space-y-6">
            {/* 팀 정보 부분 */}
            <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h2 className="font-bold mb-4">팀 정보</h2>
              
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">팀원</span>
                  <span className="font-bold">{teamMembers.length}명</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">문제 추천</span>
                  <span className="text-green-500 font-bold">활성</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">문제 난이도</span>
                  <div className="flex items-center gap-2">
                    {missionInfo?.[0]?.difficulty == "Easy" ? 
                      <span className="bg-[#ecfdf5] text-[#059669] px-2 py-0.5 rounded text-xs font-semibold">Easy</span>
                      : missionInfo?.[0]?.difficulty == "Medium" ?
                      <span className="bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded text-xs font-semibold">Medium</span> 
                      :<span className="bg-[#fef2f2] text-[#dc2626] px-2 py-0.5 rounded text-xs font-semibold">Hard</span> }
                    
                  </div>
                </div>
                

                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-500">알고리즘 태그</span>
                    
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {infoTags.map(tag => (
                      <span key={tag} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md font-medium border border-blue-100">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-gray-500 block mb-2">추천 요일</span>
                  <div className="flex gap-1.5">
                  {['월', '화', '수', '목', '금', '토', '일'].map(day => {
                    const isSelected = selectedDays.includes(day);

                    return (
                      <button
                        key={day}
                        type="button"
                        
                        className={`relative flex-1 py-2 rounded-lg text-[13px] font-bold transition-all border
                          ${isSelected ? 
                              'bg-[#f0f6ff] border-[#dbeafe] text-[#4F6EF7]' 
                            : 'bg-white border-gray-100 text-gray-300 hover:bg-gray-50'}`}
                      >
                        
                        {day}
                      </button>
                    );
                  })}
                </div>
                </div>
              </div>
            </section>

            {/* 멤버 목록 */}
            <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
              <h2 className="font-bold mb-4">멤버 ({teamMembers.length})</h2>
              <div className="space-y-1">
                {teamMembers.map((member:any, i:any) => (
                  <div key={i} className={`flex items-center justify-between p-2 rounded-lg ${member.isMe ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${member.isMe ? 'bg-blue-600' : 'bg-gray-400'}`}>
                        {member.initial}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-sm font-semibold text-gray-800">
                          {member.name} <span className="text-blue-500 font-normal">{member.suffix}</span>
                        </div>
                        <span className="text-xs text-gray-500">{member.email}</span>
                      </div>
                    </div>
                    {member.role && (
                      <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded font-medium">
                        {member.role}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* 문제 추천 설정 모달  */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-[460px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <Settings className="text-blue-600" size={20} />
                <h2 className="text-lg font-bold text-gray-800">추천 설정</h2>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* 모달 Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              
              

              {/* 추천 요일 섹션 */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-800">
                    추천 요일 <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-blue-600 font-semibold">{selectedDays.length}개 선택됨</span>
                </div>
                <div className="flex gap-1">
                  {['월', '화', '수', '목', '금', '토', '일'].map(day => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleToggleDay(day)}
                        className={`flex-1 h-11 rounded-lg text-sm font-bold transition-all border
                          ${isSelected 
                            ? 'bg-blue-50 border-blue-500 text-blue-600 ring-2 ring-blue-50' 
                            : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 문제 난이도 구조 변경 */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-800">
                    문제 난이도 <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-gray-400 font-medium">팀 수준에 맞는 난이도를 선택하세요</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {[
                    { key: '쉬움', label: '쉬움', desc: 'Easy' },
                    { key: '보통', label: '보통', desc: 'Intermediate' },
                    { key: '어려움', label: '어려움', desc: 'Hard' }
                  ].map(item => {
                    const isSelected = difficulty === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setDifficulty(item.key)}
                        className={`flex flex-col items-center justify-center py-3.5 px-2 rounded-xl border text-center transition-all
                          ${isSelected 
                            ? 'bg-blue-50 border-blue-500 text-blue-600 ring-2 ring-blue-50' 
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                      >
                        <span className="text-sm font-bold flex items-center justify-center gap-1">
                          {item.label}
                          {isSelected && <i className="fa-regular fa-circle-check text-xs text-blue-500 ml-0.5"></i>}
                        </span>
                        <span className="text-[10px] text-gray-400 mt-1 block break-all whitespace-pre-line leading-tight">{item.desc}</span>
                      </button>
                    );
                  })}
                </div>
                
              </div>

              {/* 문제 수 섹션 레이아웃 */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-800">
                    문제 수 <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-gray-400 font-medium">매일 추천받을 문제 수</span>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setProblemCount(num)}
                      className={`flex-1 h-11 rounded-lg font-bold text-sm border transition-all 
                        ${problemCount === num 
                          ? 'bg-blue-50 border-blue-500 text-blue-600 ring-2 ring-blue-50' 
                          : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'}`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. 알고리즘 태그 검색 및 뱃지  */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  알고리즘 태그 추천
                </label>
                
                {/* 검색 인풋 */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="태그 검색 (예: DFS, 다이나믹)"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  
                  {/* 자동완성 구성 */}
                  {tagInput && filteredTags.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                      {filteredTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleAddTag(tag)}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 선택된 태그 뱃지들 */}
                <div className="flex flex-wrap gap-2 mt-3 min-h-[32px]">
                  {selectedTags.length === 0 ? (
                    <span className="text-xs text-gray-400">선택된 태그가 없습니다.</span>
                  ) : (
                    selectedTags.map(tag => (
                      <span 
                        key={tag} 
                        className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs px-2.5 py-1.5 rounded-md font-medium border border-blue-100 transition-all hover:bg-blue-100"
                      >
                        {tag}
                        <button 
                          onClick={() => handleRemoveTag(tag)}
                          className="text-blue-400 hover:text-blue-800 focus:outline-none"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* 모달 Footer  */}
            <div className="flex gap-2 p-5 border-t border-gray-100 bg-white shrink-0">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button 
                onClick={() => {
                    setIsSettingsOpen(false)
                    getRecommend()
                }
            }
                className="flex-1 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-1"
              >
                <i className="fa-regular fa-circle-check"></i> 저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}