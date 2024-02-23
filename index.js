import express from 'express'
import routerUser from './routes/userRoute.js'
import routerStudent from './routes/studentRoutes.js'
import routerTeacher from './routes/teacherRoutes.js'
import routerRole from './routes/roleRoutes.js'
import routerCourse from './routes/courseRoutes.js'
import routerEnroll from './routes/enrollmentRoutes.js'
import dotenv from 'dotenv'

const app=express();

dotenv.config()
app.use(express.json())

app.use('/api/users',routerUser)
app.use('/api/students',routerStudent)
app.use('/api/roles',routerRole)
app.use('/api/teachers',routerTeacher)
app.use('/api/courses',routerCourse)
app.use('/api/enroll',routerEnroll)

app.listen(3000,()=>{
    console.log("Sever connected to port 3000")
})