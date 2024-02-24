import express from 'express'
import { createTeacher, getTeachers, updateTeacher } from '../controllers/teacherController.js'
import { isAdmin, isTeacher } from '../middlewares/authorization.js'
import authenticateUser from '../middlewares/authenticateUser.js'

const routerTeacher=express()

routerTeacher.post('/createteacher',createTeacher)

routerTeacher.get('/getteachers',authenticateUser,isAdmin,getTeachers)

routerTeacher.put('/updateteacherdetails',authenticateUser,isTeacher,updateTeacher)


export default routerTeacher