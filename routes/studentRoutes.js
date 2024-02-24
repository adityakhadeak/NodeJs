import express from 'express'
import { createStudent, getStudents, updateStudent } from '../controllers/studentController.js'
import authenticateUser from '../middlewares/authenticateUser.js'
import { isAdmin, isStudent } from '../middlewares/authorization.js'

const routerStudent=express()

routerStudent.post('/createstudent',createStudent)

routerStudent.get('/getstudents',authenticateUser,isAdmin,getStudents)

routerStudent.put('/updatestudentdetails/:id',authenticateUser,isStudent,updateStudent)


export default routerStudent