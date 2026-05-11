export default async function page({params}:any){
    const {id} = await params
    return  (
        <div>this is {id} page</div>
    )
}