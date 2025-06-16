
import express from 'express'
import testPostController from '../Controller/testController.js'
import userAuth from '../Middleware/AuthMiddleware.js';
//router obj
 const router=express.Router();
 //routes 
 //we may add any number of middleware after  route
 router.post('/test-post',userAuth,testPostController)
 //export
 export default router
