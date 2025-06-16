
import express from 'express'
import userAuth from '../Middleware/AuthMiddleware.js'
import { updateUserController } from '../Controller/UserController.js'
//router object
const router=express.Router()


//routes

//Get users||GET

//Update user||PUT
router.put('/update-user',userAuth,updateUserController)

export default router
