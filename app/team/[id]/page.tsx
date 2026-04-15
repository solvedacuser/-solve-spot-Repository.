export default async function team({params}: any){
    
    const {id} = await params
    return(
        
        <div>
            <h1>this is {id}</h1>
        </div>
    )
}