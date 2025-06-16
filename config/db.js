
//connection with mongo db
import mongoose from "mongoose";
const connectDB=async()=>{
    try {
        const conn=await mongoose.connect('mongodb+srv://greatStack:126767898@cluster0.gmmopal.mongodb.net/jobportal').then(()=>console.log("DB Connected "))
        //console.log(`connected to mongodb ${mongoose.connection.host}`)
        
    } catch (error) {
        console.log(`MongoDb Error ${error}`)
        
    }
}
export  default connectDB;