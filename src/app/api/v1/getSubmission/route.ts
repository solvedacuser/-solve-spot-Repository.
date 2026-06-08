import { NextResponse } from "next/server"



export async function POST(request : Request){
    const {id} = await request.json()

    const response = await fetch(`https://alfa-leetcode-api.onrender.com/${id}/submission?limit=30`, {
        method : 'GET',
        headers : {}
    })
    const res = await response.json()
    console.log(res.submission)
    return NextResponse.json({text : JSON.stringify(res)})
    
    
      
}

