import userModel from "../Models/userModel.js";

export const updateUserController= async(req,res,next)=>{
    //get user what we have to update
    const {name,email,lastName,location}=req.body
    if(!name||!email||!lastName||!location){
        return next('please provide all fields')
    }
    const user =await userModel.findOne({_id:req.user.userId})
    user.name=name,
    user.lastName=lastName,
    user.email=email,
    user.location=location

    await user.save()
    const token=user.createJWT()//token created
    res.status(200).json({
        user,
        token,
    })

};