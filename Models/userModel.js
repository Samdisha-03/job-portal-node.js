
import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcryptjs'
import JWT from 'jsonwebtoken'
//schema
 const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required']
    },
    lastName:{
        type:String,

    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        validate:validator.isEmail
    },
    password:{
        type:String,
        required:[true,'password is required'],
        minlength:[6,'password length should be greater than 6 character'],
        select:true

    },
    location:{
        type:String,
        default:'India'
    }
 },{timestamps:true});
 //middleware create using mongoose
 userSchema.pre('save',async function() {//normal function doesnot work
    if(!this.isModified) return;//check password is modified or not
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);

    
 })
 //compare  password
 userSchema.methods.comparePassword=async function(userPassword){
    const isMatch=await bcrypt.compare(userPassword,this.password);
    return isMatch;
 }
 //json web token
 userSchema.methods.createJWT=function(){
    //console.log("JWT_SECRET:", process.env.JWT_SECRET); // Debug log
    if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }
    return JWT.sign({userId:this._id},process.env.JWT_SECRET,{expiresIn:'1d'});
 }


 export default mongoose.model('User',userSchema);