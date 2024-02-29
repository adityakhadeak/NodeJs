import express from 'express'
import routerUser from './routes/userRoute.js'
import routerStudent from './routes/studentRoutes.js'
import routerTeacher from './routes/teacherRoutes.js'
import routerRole from './routes/roleRoutes.js'
import routerCourse from './routes/courseRoutes.js'
import routerEnroll from './routes/enrollmentRoutes.js'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit';

const app=express();

dotenv.config()
app.use(express.json())



const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: 'Too many requests from this IP, please try again later'
  });
  
  
app.use(limiter);

app.use('/api/users',routerUser)
app.use('/api/students',routerStudent)
app.use('/api/roles',routerRole)
app.use('/api/teachers',routerTeacher)
app.use('/api/courses',routerCourse)
app.use('/api/enroll',routerEnroll)

app.listen(3000,()=>{
    console.log("Sever connected to port 3000")
})