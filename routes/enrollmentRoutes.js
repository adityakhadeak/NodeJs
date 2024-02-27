import express from 'express'
import { createEnrollment, deleteEnroll, getEnrollments, updateEnrollment } from '../controllers/enrollmentController.js'
import authenticateUser from '../middlewares/authenticateUser.js'
import { isAdmin, isAdminOrTeacher, isStudent } from '../middlewares/authorization.js'

const routerEnroll=express()

routerEnroll.post('/createenroll',isStudent,createEnrollment)

routerEnroll.post('/getenrolls',authenticateUser,isAdminOrTeacher,getEnrollments)

routerEnroll.put('/updateenrolls/:enroll_id',authenticateUser,isAdminOrTeacher,updateEnrollment)

routerEnroll.delete('/deleteenroll/:enroll_id',authenticateUser,isAdminOrTeacher,deleteEnroll)

export default routerEnroll