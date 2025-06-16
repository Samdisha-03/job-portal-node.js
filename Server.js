//import express /with this we create rest api and routing
//const express=require('express')
import express from 'express'
import dotenv from 'dotenv'
import cors from'cors'
import morgan from 'morgan'
//security packages
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';


//files imports
import connectDB from './config/db.js';
//routes
import testRoutes from './Routes/testRoutes.js'
import AuthRoutes from './Routes/AuthRoutes.js'
import errorMiddleware from './Middleware/errorMiddleware.js';
import JobsRoutes from './Routes/JobsRoute.js'
import userRoutes from './Routes/userRoutes.js';

//config .env
dotenv.config()
//mongodb connection
connectDB();
//rest object
const app=express();
//middleware with this json is used
app.use(helmet());//for header security
app.use(xss());
app.use(mongoSanitize());//mongodb data secure
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));


//routes
/*app.get('/',(req,res)=>{
    res.send('<h1>Welcome to job portal for job finding</h1>')
})*/
app.use('/api/v1/test',testRoutes)
app.use('/api/v1/auth',AuthRoutes)
app.use('/api/v1/user',userRoutes)
app.use('/api/v1/job',JobsRoutes)


//validation middleware
app.use(errorMiddleware)
//console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET);
process.env.JWT_SECRET = "manual_secret_test";
console.log("JWT_SECRET manually set:", process.env.JWT_SECRET);


//extract the port
const PORT= process.env.PORT||8070
//listen
app.listen(PORT,()=>{
    console.log(`Node server running in ${process.env.DEV_MODE ||'development'} Mode on port no ${PORT}`)
})