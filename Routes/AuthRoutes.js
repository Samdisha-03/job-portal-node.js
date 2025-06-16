
import express from 'express'
import { loginController, registerController } from '../Controller/AuthController.js';

import ratelimit from 'express-rate-limit'
//ip limiter
const limiter=ratelimit({
    windowMs:15*60*100,//15 min
    max:100,//limit each ip to 100 request per'window (here per 15 min)
    standardHeaders:true,//return ratelimit info in the ratelimit-* headers
    legacyHeaders:false,//Disable the'X-ratelimit-*' headers
})

//router object
const router =express.Router();
//routes
//register||Post
router.post('/register',limiter,registerController)
//login ||Post
router.post('/login',limiter,loginController)
//export
export default router