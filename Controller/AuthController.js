import userModel from "../Models/userModel.js";

export const registerController= async (req,res,next)=>{
    try{
    
        const{name,email,password}=req.body
        //validate
        if(!name){
           //return res.status(400).send({success:false,message:'please provide name'})
           next("Name is required");
            
        }
        if(!email){
           // return res.status(400).send({success:false,message:'please provide email'})
           next("Email is required");
        }
        if(!password){
           // return res.status(400).send({success:false,message:'please provide password'})
           next("Password is required greater than 6 character");
        }
        const existingUser=await userModel.findOne({email})
        if(existingUser){
            next("Email Already Registerd please Login")
           /* return res.status(200).send({
                success:false,
                message:"Email already registered Please Login",
            });*/
        }
        //create user
        const user=await userModel.create({name,email,password});
        //token
        const token =user.createJWT();
        res.status(201).send({
            success:true,
            message:'User created Successfully',
            user:{
                name:user.name,
                lastName:user.lastName,
                email:user.email,
                location:user.location

            },
            token
        });
    }catch(error){
        next(error);
        
    }
};
export const loginController= async(req,res,next)=>{
  const {email,password}=req.body
  //validation
  if(!email||!password){
    next('please provide all fields')
  }
  //find user by email
  const user=await userModel.findOne({email}).select('+password')//with select(+password we hide the password)
  if(!user){
    next('Invalid username and Password')
  }
  //compare password
  const isMatch=await user.comparePassword(password)
  if(!isMatch){
    next('Invalid username and Password')
  }
  user.password=undefined;
  const token=user.createJWT()
  res.status(200).json({
    success:true,
    message:'Login Successfully',
    user,
    token,
  })
};