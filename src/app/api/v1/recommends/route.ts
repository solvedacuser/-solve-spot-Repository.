import { NextResponse } from "next/server"


const difficulty = [
    {
        id : "쉬움",
        param : "EASY"
    },
    {
        id : "보통",
        param : "MEDIUM"
    },
    {
        id : "어려움",
        param : "HARD"
    },
]


const tagInfo = [
    {ko : "다이나믹 프로그래밍" , en : "dynamic-programming"},
    {ko : "그래프 이론" , en : "graph"},
    {ko : "그리디 알고리즘" , en : "greedy"},
    {ko : "정렬" , en : "sorting"},
    {ko : "DFS" , en : "depth-first-search"},
    {ko : "BFS" , en : "breadth-first-search"},
    {ko : "이진 탐색" , en : "binary-tree"},
    {ko : "문자열" , en : "string"},
    {ko : "해시" , en : "hash-table"},
    {ko : "트리" , en : "tree"},
    {ko : "최단 경로" , en : "shortest-path"},
    {ko : "스택" , en : "stack"}
]

const tgs:any = {
    "다이나믹 프로그래밍" : "dynamic-programming",
    "그래프 이론" : "graph",
    "정렬" : "sorting",
    "DFS" : "depth-first-search",
    "BFS" : "breadth-first-search",
    "이진 탐색" : "binary-tree" , 
    "문자열" : "string",
    "해시" : "hash-table",
    "최단 경로" : "shortest-path",
    "스택" : "stack"
}
    


export async function POST(request : Request){
    const {tags, diff, count} = await request.json()
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    console.log("tags : ",tags, "diff : ", diff, "count : ", count)
    let diffParam:string = ""
    let tagParam = ""

    difficulty.forEach((elem, idx) => {
        if(elem.id == diff) diffParam = elem.param
    })
    let tagmap:string[] = []
    if(tags.length > 0){
        tags.forEach((elem:any) => {
            tagmap.push(tgs[elem])
        })
        
        
        let tag = tagmap.join("+")
        tagParam = "&tags=" + tag
        console.log("tagparam ", tagParam)
    }
    else{
        console.log("tags length is 0")
    }
    let response = await fetch(`https://alfa-leetcode-api.onrender.com/problems?difficulty=${diffParam}` + `${tagParam}`)
    let res = await response.json()
    console.log("status", response.status)
    let max = res.totalQuestions - count
    const skipParam = max > 0 ? Math.floor(Math.random() *(max+1)) : 0
    console.log(skipParam)
    await delay(500)
    response = await fetch(`https://alfa-leetcode-api.onrender.com/problems?difficulty=${diffParam}&skip=${skipParam}` + `${tagParam}&limit=${count}`)
    res = await response.json()
    if(res.count == 0) return NextResponse.json(null)
    let responseArr = []

    
    const titles = res.problemsetQuestionList.map((elem:any) => {
        return elem.titleSlug
    })
    for(let i = 0 ; i < titles.length ; i++){
        try {
            await delay(500)
            const response = await fetch(`https://alfa-leetcode-api.onrender.com/select?titleSlug=${titles[i]}`)
            const data = await response.json()
            const item = {
                "id": i,
                "tags" : data.topicTags.map((elem:any) => elem.slug),
                "time": "5:11",
                "ratio": String((Math.random() * (5.7 - 2.1) + 2.1).toFixed(1)),
                "title":  data.questionTitle,
                "users": String(Math.floor(Math.random() * 2000) + 300),
                "status": "pending",
                "levelIcon": String(i),
                "problemNum": "#" + data.questionId,
                "titleSlug" : data.titleSlug,
                "solved" : [],
                "link" : data.link
            }
            responseArr.push(item)
        }
        catch(error) {
            console.log(`[${titles[i]}] 파싱 에러:`, error)
        }
        
    }
    
    console.log(responseArr)
    return NextResponse.json(responseArr)
}