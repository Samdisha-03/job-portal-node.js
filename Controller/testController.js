
const testPostController=(req,res)=>{
    const {name}=req.body
    res.status(200).send(`Your Name is ${name}`)

}
//export 
export default testPostController