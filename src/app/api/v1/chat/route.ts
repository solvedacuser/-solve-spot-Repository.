import { NextResponse } from "next/server"

const example = `
\`\`\`javascript
function threeSum(nums) {
    const results = [];
    nums.sort((a, b) => a - b);

    for (let i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;

        let left = i + 1;
        let right = nums.length - 1;

        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];

            if (sum === 0) {
                results.push([nums[i], nums[left], nums[right]]);
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    return results;
}
\`\`\`
`


export async function POST(request : Request){
    const apiKey = process.env.GEMINI_API_KEY!;
    const apiEndpoint = process.env.GEMINI_API_ENDPOINT!;
    try{
        const {chatLog, message} = await request.json()
    
    
        const systemIns = `사용자의 질의에 대해 자세하게 답변해주고 만약 문제 제목을 제시하면 해당 문제에 대한 풀이를 제시하는데 모든 코드 부분은 무조건 코드 블럭을 포함해서 예시 코드를 제시해, 다음은 코드 블럭 예시야 ${example} 만약 사용자의 질의에 힌트라는 단어가 포함되어 있다면 문제 해결 방안만 제시하고 직접적인 코드는 제시하지마  모든 답변에서 코드 블럭을 제외한 모든 MarkDown(특히 quotes, **)은 무조건 제거`
        let text = ""
        if(message) text = message
        // const text = `{title : ${data.title} ,code : ${data.code}}`
        let payload = {
            system_instruction : {parts : [{text : systemIns}]},
            contents : []
        }
        payload.contents = chatLog.map((elem:any) => ({
            role : elem.role == "assistant" ? 'model' : 'user',
            parts : [{text : elem.content}]
        }))
        console.log("chatLog", payload.contents)
        
        
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
        
        return NextResponse.json({message : responseText})
    }catch(error){
        return NextResponse.json({ErrorType : "Internal_Server_Error", message : "현재 서버가 불안정합니다 잠시 후에 다시 시도해주세요"}, {status : 500});
    }
    
    
    
      
}

