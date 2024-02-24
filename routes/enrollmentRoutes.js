import express from 'express'
import { createEnrollment, getEnrollments, updateEnrollment } from '../controllers/enrollmentController.js'
import authenticateUser from '../middlewares/authenticateUser.js'
import { isAdmin, isAdminOrTeacher, isStudent } from '../middlewares/authorization.js'

const routerEnroll=express()

routerEnroll.post('/createenroll',isStudent,createEnrollment)

routerEnroll.post('/getenrolls',authenticateUser,isAdminOrTeacher,getEnrollments)

routerEnroll.put('/updateenrolls/id',authenticateUser,isAdminOrTeacher,updateEnrollment)

export default routerEnroll