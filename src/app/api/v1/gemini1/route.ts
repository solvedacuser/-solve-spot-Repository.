import { NextResponse } from "next/server"



export async function POST(request : Request){
  const apiKey = process.env.GEMINI_API_KEY!;
  const apiEndpoint = process.env.GEMINI_API_ENDPOINT!;
  let payload = {
    "system_instruction": {
      "parts": [
        {
          "text": "사용자는 leetcode 내의 알고리즘 문제를 푸는 중이고 중간에 작성한 코드에 대해 질의하는 중이야, 사용자가 입력한 코드를 간단하게 분석하고 설명을 해주는데 예시 코드가 필요하다면 전체 코드 1개만 구성하고 코드 부분은 무조건 코드블럭을 감싼 형태로 표현해 해당 문제와 비슷한 leetcode 내의 추천 문제를 추천해줘 응답은 json 형식으로 주는데 {recommend : [], analysis : text } 이런 형식으로 응답을 주고 recommend에는 추천 문제들에 대한 object들을 구성하여 각 object에는 문제 제목, 난이도, 문제 번호를 포함하고 analysis에는 분석 결과를 담는데 코드 부분에 대한 설명은 코드 블록 마크다운으로 표시하고 그 외의 모든 MarkDown(특히 quotes, ** 사용 금지)은 제거"
        }
      ]
    },
    "contents": [
      {
        "parts": [
          {
            "text": ""
          }
        ]
      }
    ],
    "generationConfig": {
        "responseMimeType": "application/json"
      }
  }
  try{
    const {data} = await request.json()
    
    console.log(data)
    const text = `leetCode의 ${data.title} 문제에 대해 나는 이렇게 코드를 구성했어 ${data.code} 내가 작성한 코드를 분석한 결과를 보여줘`
    
    console.log(text)
    payload['contents'][0]['parts'][0]['text'] = text
    
    
    
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
              return NextResponse.json({ErrorType : "Token_Exceed", message : "토큰 사용량이 초과되었습니다 잠시 후에 다시 시도해주세요"}, {status : 429})
          case 500:
          case 503:
              return NextResponse.json({ErrorType : "Internal_Error", message : "현재 API 서버 내부가 불안정합니다 잠시 후에 다시 시도해주세요"}, {status : 500})
          default :
              return NextResponse.json({ErrorType : "Default_Error", message : "API 내부 시스템에 에러가 발생했습니다 잠시 후에 다시 시도해주세요"}, {status : status}) ;

      }
  }

    const res = await response.json()
    
    const responseText = res['candidates'][0]['content']['parts'][0]['text']
    console.log("responseText : ", responseText)
    return NextResponse.json(JSON.parse(responseText))
    
  }catch(error) {
    console.error("Backend Runtime Error:", error)
    return NextResponse.json({ErrorType : "Internal_Server_Error", message : "현재 서버가 불안정합니다 조금 기다린 후에 다시 시도해주세요"}, {status : 500});
  }
    
    
      
}

