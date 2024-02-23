import express from 'express'
import { createStudent, getStudents } from '../controllers/studentController.js'
import authenticateUser from '../middlewares/authenticateUser.js'
import { isAdmin } from '../middlewares/authorization.js'

const routerStudent=express()

routerStudent.post('/createstudent',createStudent)

routerStudent.get('/getstudents',authenticateUser,isAdmin,getStudents)

export default routerStudent