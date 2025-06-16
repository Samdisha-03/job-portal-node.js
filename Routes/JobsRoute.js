
import express from 'express'
import userAuth from '../Middleware/AuthMiddleware.js'
import { createJobController, deleteJobController, getAllJobsController, jobsStatsController, updateJobController } from '../Controller/JobsController.js'
const router =express.Router()

//routes
//create job||Post
router.post('/create-job',userAuth,createJobController)
//get jobs||get
router.get('/get-job',userAuth,getAllJobsController)

//Update jobs|| put||patch
router.patch('/update-job/:id',userAuth,updateJobController);


//delete.jobs ||delete
router.delete('/delete-job/:id',userAuth,deleteJobController)

//job stat  ||get
router.get('/job-stats',userAuth,jobsStatsController)

export default router