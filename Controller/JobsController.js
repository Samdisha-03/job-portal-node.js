import JobsModel from "../Models/JobsModel.js";
import mongoose from 'mongoose';
//import moment from 'moment'

export const createJobController=async(req,res,next)=>{
    const {company,position}=req.body
    if(!company||!position){
        next('Please Provide All Fields')
    }
    req.body.createdBy=req.user.userId
    const jobs=await JobsModel.create(req.body);
    res.status(201).json({jobs});
};
//=======Get Job=====
export const getAllJobsController= async(req,res,next)=>{
    const {status,workType,search,sort}=req.query
    //condition for searching
    const queryObject={
        createdBy:req.user.userId
    }
    //logic filter
    if(status && status !=='all'){
        queryObject.status=status;
    }
    if(workType && workType!=='all'){
        queryObject.workType=workType;

    }
    if(search){
        queryObject.position={$regex:search,$options:'i'};
    }
    let queryResult=JobsModel.find(queryObject)
    //sorting
    if(sort==='latest'){
        queryResult=queryResult.sort('-createdAt')
    }
    if(sort==='oldest'){
        queryResult=queryResult.sort('createdAt')
    }
    if(sort==='a-z'){
        queryResult=queryResult.sort('position')
    }
    if(sort==='z-a'){
        queryResult=queryResult.sort('-position')
    }
    //pagination
    const page=Number(req.query.page)||1
    const limit=Number(req.query.limit)||10
    const skip=(page-1)*limit
    queryResult=queryResult.skip(skip).limit(limit)
    //job counts
    const totalJobs=await JobsModel.countDocuments(queryResult)
    const numofPage=Math.ceil(totalJobs/limit)


    const jobs=await queryResult;

    //const jobs =await JobsModel.find({createdBy:req.user.userId})
    res.status(200).json({
        totalJobs,
        jobs,
        numofPage
    })

};

//update jobs
export const updateJobController = async(req,res,next)=>{
    const {id}=req.params
    const {company,position}=req.body
    //validation
    if(!company||!position){
        next('Please Provide All Fields')
    }

    //find job
    const job=await JobsModel.findOne({_id:id})
    //validation
    if(!job){
        next(`no jobs found with this id ${id}`)
    }
    //on the base of id 
    if(!req.get.userId===job.createdBy.toString()){
        next('You are not Authorized to Update this job');
        return;
    }
    const updateJob=await JobsModel.findOneAndUpdate({_id:id},req.body,{
        new:true,
        runValidators:true,
    });
    //res
    res.status(200).json({updateJob});


};

//delete job
export const deleteJobController=async(req,res,next)=>{
    const {id}=req.params
    //find job
    const job=await JobsModel.findOne({_id:id})
    //validation
    if(!job){
        next(`No JOb Found With This id ${id}`)
    }
    if(!req.user.userId===job.createdBy.toString()){
        next('You are not Authorized to delete this job');
        return;

    }
    await job.deleteOne();
    res.status(200).json({message:"Success,Job Deleted!"});
};

//job stats and filter
export const jobsStatsController=async(req,res)=>{
    //aggregate func
    const stats =await JobsModel.aggregate([
        //search by user job
        {
            $match:{
                createdBy:new mongoose.Types.ObjectId(req.user.userId),
            },
        },
        {
             $group:{
                _id:'$status',
                count:{$sum:1},
            },
        }
    ]);
    //default stats
    const defaultStats={
        pending:stats.pending||0,
        reject:stats.reject||0,
        interview:stats.interview||0
    };

    //monthly stats
    let monthlyApplication=await JobsModel.aggregate([
        {
            $match:{
                createdBy:new mongoose.Types.ObjectId(req.user.userId),
            },
        },
        {
            $group:{
                _id:{
                    year:{$year:'$createdAt'},
                    month:{$month:'$createdAt'},
                },
                count:{
                    $sum:1,
                },

            },
        },
    ]);
  /*  monthlyApplication=monthlyApplication.map(item=>{
        const {_id:{year,month},count}=item
        const date=moment().month(month-1).year(year).format('MMM Y')
        return{date,count};
    })
    .reverse();*/
    res.status(200).json({ totalJobs:stats.length,defaultStats,monthlyApplication});

};
