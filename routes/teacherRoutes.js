import express from 'express'
import { createTeacher, getTeachers } from '../controllers/teacherController.js'
import { isAdmin } from '../middlewares/authorization.js'
import authenticateUser from '../middlewares/authenticateUser.js'

const routerTeacher=express()

routerTeacher.post('/createteacher',createTeacher)

routerTeacher.get('/getteachers',authenticateUser,isAdmin,getTeachers)


export default routerTeacher