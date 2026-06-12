"use client"
import { ArrowUpIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Toaster } from "@/components/ui/toaster"
import {
    Card,
    // CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import { Button } from "@/components/ui/button"
  import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Noto_Sans_KR } from 'next/font/google';

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

import { useToast } from "@/hooks/use-toast"

import Link from "next/link"
import { useEffect, useReducer, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Session } from "@supabase/supabase-js";


  export default function page(){
    const [name, setName] = useState("")
    const [username, setDescription] = useState("")
    const [coworker, setCoworker] = useState("")
    const [teams, setTeam] = useState<any[] | null>([])
    const [member, setMember] = useState<any[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [session, setSession] = useState<Session | null>(null)
    const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({})
    const [supabase] = useState(() => createClient()) 
    const { toast } = useToast()
    const router = useRouter()
    useEffect(() => {
        const getSession = async() => {
            const {data} = await supabase.auth.getSession()
            setSession(data.session)
            console.log(data.session?.user.user_metadata.boj_handle)
        }
        getSession()
    },[])
    useEffect(() => {
        const getTeam = async() => {
        let { data: team, error } = await supabase
        .from('team')
        .select('*')
        .order("createdAt", { ascending: false })
        setTeam(team)
        console.log("teams", team)
        if(error)
        console.log("team error " ,error)
        }
        getTeam()
    },[])
    
    console.log("session", session)
    const getUsers = async () => {
        let { data: team, error } = await supabase
        .from('team')
        .select('*')
        console.log("data :", team)
    }


    const getUser = async() => {
            let { data: user, error } = await supabase
            .from('profiles')
            .select("*")
            .eq('boj_handle', coworker)
            .maybeSingle()
            if(user){
                console.log("Detected", user.boj_handle)
                if(!member?.find((elem) => elem.boj_handle == user.boj_handle)){
                    setMember([...member, user])
                }
            }
            else{
                console.log("there is no user")
                toast({
                    title: "해당하는 사용자가 없습니다",
                    description: "사용자 ID를 정확하게 입력하였는지 확인해주세요",
                  })
            }
    }              
    const toggleExpand = (e: React.MouseEvent, teamId: string) => {
        e.preventDefault(); 
        setExpandedTeams((prev) => ({
            ...prev,
            [teamId]: !prev[teamId]
        }))
    }


    const submitHandler = async() => {
        
        console.log("sdf")
        // const coworkers = coworker.split(',')
        console.log("teamName : " , name)
        console.log("teamName : " , username)
        console.log("coworker : ", coworker)
        let members = []
        member.map((elem) => {
            members.push(elem.id)
        })
        try {
        const { data: userData } = await supabase.auth.getUser();

        console.log("data", userData.user);
        const { data, error } = await supabase
        .from('team')
        .insert([
            { teamName: name, description: username, teamLeader: session?.user.user_metadata.boj_handle,  UserList: member, isActivated : 1}
        ])
        .select()
        const {error: LeaderError} = await supabase
            .from('team_members')
            .insert([
                {team_id: data?.[0].rid,
                user_id: session?.user.id,
                role: 'Leader'}
            ])
        for(let memberInfo of member ){
            await supabase
            .from('team_members')
            .insert([
                {team_id: data?.[0].rid,
                    user_id: memberInfo.id,
                    role: 'Member'}
            ])
        }

       
        
        setIsOpen(false)
        if(data == null){
            return
        }
        
        router.push(`/team/${data[0].rid}`)
        router.refresh()
        }
        catch (err){
            console.log("insert error : ", err)
        }
        
        

            
    }

    return(
        <div id="teams" className={`mx-[200px] my-[50px] mt-[100px] p-[20px]  rounded-lg ${notoSansKr.className}`}>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"/>
            <div className="flex items-end justify-between mb-8 pb-6 border-b border-gray-100">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {/* <i className="fa-solid fa-layer-group text-[#4F6EF7]"></i> */}
            {/* <i className="fa-solid fa-list text-[#4F6EF7]" ></i> */}
            
            스터디 참여 현황 
          </h3>
          <p className="text-[14px] text-gray-500 mt-2">
            함께 알고리즘 문제를 풀고 성장할 스터디 팀을 만들고 관리해보세요.
          </p>
          <div className="flex gap-2 mt-4">
            <Badge variant="secondary" className="bg-white text-[#4F6EF7] hover:bg-white border-none px-3 py-1">
              <i className="fa-solid fa-users mr-[6px]"></i> 참여 중인 팀 {teams?.length || 0}개
            </Badge>
            <Badge variant="outline" className="bg-white text-gray-500 px-3 py-1">
              <i className="fa-solid fa-circle-check text-[#22c95f] mr-[6px]"></i> 전체 활성화 됨
            </Badge>
          </div>
        </div>
                
                
                <Dialog open={isOpen} onOpenChange={(open) => {
                    
                    setIsOpen(open); 
                    if(!open) setMember([])
                    }}>
                
                <Button className=" ml-auto" variant="outline" onClick={(e) => {
                    if(!session){
                        router.push("/login")
                        return
                    }
                    setIsOpen(true)
                }}>+ 팀 추가하기</Button>
                
        
       
        
        <DialogContent className="sm:max-w-sm">
        <form onSubmit={(e) => {
            e.preventDefault()
            submitHandler()
        }}>
          <DialogHeader>
            <DialogTitle>새로운 팀 생성하기</DialogTitle>
            <DialogDescription>
              새로운 팀을 생성하고 스터디를 진행하세요
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field className="mt-3">
              <Label htmlFor="name-1">팀 이름</Label>
              <Input id="name-1" name="name" placeholder="팀 이름" onChange={(e) => {setName(e.target.value)}}/>
            </Field>
            <Field>
              <Label htmlFor="username-1">팀 Description</Label>
              <Input id="username-1" name="username" placeholder="팀 설명" onChange={(e) => {setDescription(e.target.value)}} />
            </Field>
            <Field>
              <Label htmlFor="username-1">초대할 팀원 ID</Label>
              <div className="flex item-center gap-2">
                <Input  id="username-1" name="coworker" placeholder=", 로 구분해주세요" onChange={(e) => {setCoworker(e.target.value)}} />
            <Button type="button" onClick={getUser} variant="outline" size="icon" aria-label="Submit">
        <ArrowUpIcon />
      </Button>  
              </div>
              <div className="flex w-full flex-wrap gap-2">
                {
                    member.map((elem, idx) => {
                        return(
                           <Badge key={idx} variant="secondary">{elem.boj_handle}
                           <button type="button" className="ml-2" onClick={() => {
                            setMember(member.filter((x) => x.boj_handle != elem.boj_handle)) 
                           }}>X</button>
                           </Badge>
                        )
                    })
                }
                 
              </div>
           
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-5">
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button type="submit">팀 생성하기</Button>
          </DialogFooter>
          </form>
            </DialogContent>
      
            </Dialog>
                
            </div>
            {
                teams?.map((elem, idx) => {
                    const isExpanded = expandedTeams[elem.rid] || false;
                    return(
                        
                        
                        <Link key={idx} href={"/team/" + elem.rid} className="my-8">
                            <div className="bg-white rounded-2xl p-5 border border-gray-200 relative my-[10px]">
                        <div className="flex justify-between">
                            <div className="flex items-center gap-[10px]">
                                <div className="rounded-xl flex w-[40px] h-[40px] bg-[#eef1fe]  items-center justify-center" >
                                <i className="fa-solid fa-users text-[#4F6EF7]" />
                                </div>
                                <div className="">
                                <div className="text-[15px] font-bold text-gray-900 ">{elem.teamName}</div>
                                    <span className="text-[10px] text-gray-500 bg-gray-100 rounded px-[7px] py-[2px] font-medium">
                                        <i className="fa-solid fa-building text-[9px] mr-[3px]" />
                                        팀 #{elem.rid}
                                    </span>
                                </div>
                                
                            </div>
                            <div className="text-[#22c95f] text-[12px] font-bold">
                                활성화
                            </div>
                            
                        </div>
                        <p className="text-[13px] text-gray-500 leading-[1.65] my-3">{elem.description}</p>
                                <div className="flex mb-[14px] gap-[8px]">
                                    <div className="flex items-center gap-[5px] px-[10px] py-1 rounded-md bg-slate-50 border border-gray-200 text-[11px] text-gray-500 font-medium">
                                        <i className="fa-solid fa-diagram-project text-gray-400"/>
                                        문제 해결 3개
                                    </div>
                                    <div className="flex items-center gap-[5px] px-[10px] py-1 rounded-md bg-slate-50 border border-gray-200 text-[11px] text-gray-500 font-medium">
                                        <i className="fa-solid fa-user-group text-gray-400"/>
                                        {elem.UserList.length+1}명
                                    </div>
                                    <div className="flex items-center gap-[5px] px-[10px] py-1 rounded-md bg-slate-50 border border-gray-200 text-[11px] text-gray-500 font-medium">
                                        <i className="fa-regular fa-calendar text-gray-400" />
                                        {new Date(elem.createdAt).toLocaleDateString("sv-SE", {timeZone: "Asia/Seoul"})}
                                    </div>
                                </div>

                                <div className="flex w-full bg-[#f8fafc] justify-between rounded-xl py-[10px] px-[13px] border border-gray-200">
                                    <div className="flex items-center gap-[8px]">
                                        <div className="bg-[#dbdbdb] w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white border-2 border-white"><i className="fas fa-user"></i></div>
                                        
                                            <div className="">
                                                <div className="text-[12px] font-bold">
                                                <i className="fa-solid fa-crown text-amber-500 text-[9px] mr-1" />
                                                @{elem.teamLeader}
                                                </div>
                                                <div className="text-[10px] text-gray-400 mt-[1px]">팀장</div>
                                            </div>
                                            
                                        
                                            
                                    </div>
                                    <div>
                                        <button 
                                        onClick={(e) => toggleExpand(e, elem.rid)}
                                        className="flex items-center gap-[5px] mt-[2px] py-[5px] px-3 rounded-md border border-gray-200 bg-white text-[12px] font-semibold text-gray-500"
                                    >
                                        <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'} text-[10px]`} />
                                        팀원 상세보기
                                        </button>
                                    </div>
                                    {/* <div>sdf</div> */}
                                            
                                </div>
                                
                                {/* 팀원 목록 */}
                                <div className={`extended mt-[14px] pt-[14px] border-t border-gray-200 ${isExpanded ? 'block' : 'hidden'}`} >
                                    <div className="text-[11px] text-gray-400 font-medium py-[8px] pb-1 flex items-center gap-[5px]">
                                        <i className="fa-solid fa-users" />
                                        팀원 목록
                                    </div>
                                    {/* 팀장 표현 */}
                                    <div className="flex items-center gap-2 py-[7px] border-b border-slate-100">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white border-2 border-white bg-blue-500">K</div>
                                            <div className="flex-1">
                                                <div className="text-[12px] font-bold" >@{elem.teamLeader}
                                                    <span className="ml-[5px] text-[9px] bg-amber-50 text-amber-800 rounded-[3px] px-[5px] py-px font-semibold">
                                                    <i className="fa-solid fa-crown mr-[2px] text-[8px]"  />
                                                    팀장
                                                    </span>

                                                </div>
                                                <div className="text-[10px] text-[#9ca3af] ">팀장</div>
                                            </div>
                                            
                                            <span className="px-2 py-[2px] rounded text-[11px] font-medium bg-blue-50 text-blue-500">팀장</span>
                                        
                                    </div>
                                    {/* 팀원 표현 */}
                                    {
                                        elem.UserList.map((member:any, idx:number) => {
                                            return(<div key={idx} className="flex items-center gap-2 py-[7px] border-b border-slate-100">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white border-2 border-white bg-gray-300">{member.boj_handle[0].toUpperCase()}</div>
                                                    <div className="flex-1">
                                                        <div className="text-[12px] font-bold" >@{member.boj_handle}
                                                            
        
                                                        </div>
                                                        <div className="text-[10px] text-[#9ca3af] ">팀원</div>
                                                    </div>
                                                    
                                                    <span className="px-2 py-[2px] rounded text-[11px] font-medium bg-gray-50 text-gray-500">팀원</span>
                                                
                                            </div>)
                                        })
                                    }
                                    
                                    
                                </div>
                    </div>
                        </Link>
                   
                    )
                })
            }
            
            
           
            
        </div>
    )
  }