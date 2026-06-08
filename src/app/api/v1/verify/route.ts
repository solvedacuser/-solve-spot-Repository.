import { NextResponse } from "next/server"

// 1779069356 1779393920
// 1776241421
import { createClient } from "@/utils/supabase/client"

export async function POST(request : Request){
    const supabase = createClient()
    const {title, user, missionList, created_At, teamId, session} = await request.json()
    console.log("title", title, user, created_At)
    let status = false
    
    let limit = Math.floor(Math.random() *(200))
    const recommendDate = Math.floor(new Date(created_At).getTime()/1000)
    const response = await fetch(`https://alfa-leetcode-api.onrender.com/${user}/acSubmission?limit=${limit}`)
    const res = await response.json()
    console.log(res)
    console.log("mission" , missionList)
    for(let elem of res.submission){
        if(title == elem.titleSlug){
            if(elem.timestamp >= recommendDate){
                console.log("sdf")
                const mission = missionList.find((element:any) => element.titleSlug == title)
                if(mission){
                    mission.solved.push(user)
                    status = true 
                    
                    
                    break
                }
               
            }
        }   
    }
    
    const { data, error } = await supabase
    .from('teamMission')
    .update({ missions: missionList })
    .eq("created_At", created_At)
    .select()
    console.log("data " , data)
    
    const {error : insertError} =  await supabase
        .from('team_mission_solves')
        .insert([
            // { user_id : user, teamId : teamId, title : mission.title, pNum : mission.problemNum },
            {team_mission_id : data?.[0]?.rid , team_id : teamId, leetcode_username : user, title_slug : title, difficulty : data?.[0]?.difficulty}
        ])
        .select()
        if(insertError) console.log("error : ", insertError)
    
    return NextResponse.json({"status" : status, data : error ? null : data})
}