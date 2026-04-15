"use client"
import { ArrowUpIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "sonner"
import {
    Card,
    CardAction,
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
import { supabase } from "@/utils/supabase"



import Link from "next/link"
import { useEffect, useReducer, useState } from "react"
import { useRouter } from "next/navigation"


  export default function page(){
    const [name, setName] = useState("")
    const [username, setDescription] = useState("")
    const [coworker, setCoworker] = useState("")
    const [teams, setTeam] = useState<any[] | null>([])
    const [member, setMember] = useState<any[]>([])
    const router = useRouter()
    useEffect(() => {
        const getTeam = async() => {
        let { data: team, error } = await supabase
        .from('team')
        .select('*')
        setTeam(team)
        }
        getTeam()
    },[])
    console.log(teams)
    const getUser = async() => {
            let { data: user, error } = await supabase
            .from('user')
            .select("*")
            .eq('id', coworker)
            .single()
            if(user){
                console.log("Detected")
                if(!member?.find((elem) => elem.id == user.id)){
                    setMember([...member, user])
                }
            }
            else{
                console.log("there is no user")
                toast.warning("해당하는 사용자가 없습니다. " , { position: "bottom-right" } )
            }
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
        const { data, error } = await supabase
        .from('team')
        .insert([
            { teamName: name, description: username, teamLeader: "Session Mapping",  UserList: member, isActivated : 1}
        ])
        .select()
        // router.push("/front")
        

            
    }

    return(
        <div>
            <div className="ml-100">
                
                <Dialog>
            <DialogTrigger asChild>
          <Button className="mt-5 ml-132" variant="outline">+ 팀 추가하기</Button>
        </DialogTrigger>
        
       
        
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
                           <Badge key={idx} variant="secondary">{elem.id}
                           <button type="button" className="ml-2" onClick={() => {
                            setMember(member.filter((x) => x.id != elem.id)) 
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
                    return(
                        <Link key={idx} href={"/team/" + elem.rid}>
                <Card className="w-50% mx-100 my-5">
                    <CardHeader>
                        <CardTitle>{elem.teamName}</CardTitle>
                        <CardDescription>@{elem.teamLeader} 아이콘 3명</CardDescription>
                        <CardAction className="text-green-500">활성화</CardAction>
                    </CardHeader>
                    <CardContent>
                        <p>{elem.description}</p>
                    </CardContent>
                    
                </Card>
            </Link>
                    )
                })
            }
            <Link href={"/"}>
                <Card className="w-50% mx-100 my-5">
                    <CardHeader>
                        <CardTitle>Card Title</CardTitle>
                        <CardDescription>@chcl77 아이콘 3명</CardDescription>
                        <CardAction>클릭 시 이동</CardAction>
                    </CardHeader>
                    <CardContent>
                        <p>Card Content</p>
                    </CardContent>
                    
                </Card>
            </Link>
            <Link href={"/"}>
                <Card className="w-50% mx-100 my-5">
                    <CardHeader>
                        <CardTitle>Card Title</CardTitle>
                        <CardDescription>@chcl77 아이콘 3명</CardDescription>
                        <CardAction>클릭 시 이동</CardAction>
                    </CardHeader>
                    <CardContent>
                        <p>Card Content</p>
                    </CardContent>
                    
                </Card>
            </Link>
            <Link href={"/"}>
                <Card className="w-50% mx-100 my-5">
                    <CardHeader>
                        <CardTitle>Card Title</CardTitle>
                        <CardDescription>@chcl77 아이콘 3명</CardDescription>
                        <CardAction>클릭 시 이동</CardAction>
                    </CardHeader>
                    <CardContent>
                        <p>Card Content</p>
                    </CardContent>
                    
                </Card>
            </Link>
            
        </div>
    )
  }