import { NextResponse } from "next/server"

const sysPrompt = `You are a JSON data generator. Your sole task is to generate a list of algorithmic coding problems from leetCode.
You must return ONLY a valid JSON array of objects. Do not include any explanations, greetings, or markdown formatting (such as \`\`\`json or \`\`\`).

Every object in the array MUST strictly follow this exact schema and data types:
{
  "id": (integer) Unique identifier,
  "platform": (string) The platform of the problem (e.g., "LeetCode", "Baekjoon", "Programmers"),
  "title": (string) Title of the problem,
  "reason": (string) Explanation of why this problem is recommended or what it focuses on (in Korean),
  "difficulty": (string) Difficulty level (e.g., "Easy", "Medium", "Hard"),
  "difficultyColor": (string) Tailwind CSS class representing the difficulty color (e.g., "bg-yellow-100 text-yellow-700"),
  "tags": (array of strings) Algorithm tags (in Korean, e.g., ["BFS", "그래프"]),
  "estimatedTime": (string) Estimated time to solve (in Korean, e.g., "30분"),
  "solvedCount": (integer) Number of people who solved it,
  "successRate": (number) Success rate percentage (e.g., 43.5),
  "link": (string) LeetCode URL to the problem
}

Output ONLY the raw JSON array. Any other text will cause a system failure.`

export async function POST(request : Request){
    const apiKey = process.env.GEMINI_API_KEY!;
    const apiEndpoint = process.env.GEMINI_API_ENDPOINT!;
    try{
        const {chatLog} = await request.json()
    
    
        const systemIns = sysPrompt
        const text = "추천 문제 6개 구성"
        // const text = `{title : ${data.title} ,code : ${data.code}}`
        let payload = {
            system_instruction : {parts : [{text : systemIns}]},
            contents : [{ role: "user", parts: [{ text: text }] }]
        }
        // payload.contents = chatLog.map((elem:any) => ({
        //     role : elem.role == "assistant" ? 'model' : 'user',
        //     parts : [{text : elem.content}]
        // }))
        console.log("text", text)
        
        
        const response = await fetch (apiEndpoint, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
                'x-goog-api-key' : apiKey
            },
            body : JSON.stringify(payload)
    
        })
        if(!response.ok){
            const status = response.status
            const errorMessage = await response.json().catch(() => {})
            console.log("errorMessage : ", errorMessage)
            console.log("status", status)
            switch(status){
                case 429 :
                    return NextResponse.json({ErrorType : "Token_Exceed", message : "토큰 사용량이 초과되었습니다 잠시 후에 다시 시도해주세요"} ,{status : 429})
                case 500:
                case 503:
                    return NextResponse.json({ErrorType : "Internal_Error", message : "현재 API 서버 내부가 불안정합니다 잠시 후에 다시 시도해주세요"} ,{status : 500})
                default :
                    return NextResponse.json({ErrorType : "Default_Error", message : "API 내부 시스템에 에러가 발생했습니다 잠시 후에 다시 시도해주세요"}, {status : status});
    
            }
        }
    
    
        const res = await response.json()
        // console.log(res)
        const responseText = res['candidates'][0]['content']['parts'][0]['text']
        console.log("responseText", responseText)
        
        return NextResponse.json(JSON.parse(responseText))
    }catch(error){
        return NextResponse.json({ErrorType : "Internal_Server_Error", message : "현재 서버가 불안정합니다 잠시 후에 다시 시도해주세요"}, {status : 500});
    }
    
    
    
      
}

