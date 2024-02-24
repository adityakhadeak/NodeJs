import express from 'express'
import { createCourse, getCourses, updateCourse } from '../controllers/courseController.js'
import authenticateUser from '../middlewares/authenticateUser.js'
import { isAdmin, isAdminOrTeacher, isStudent } from '../middlewares/authorization.js'

const routerCourse=express()

routerCourse.post('/createcourse',createCourse)

routerCourse.get('/getcourses',authenticateUser,isAdmin,isStudent,getCourses)

routerCourse.put('/updatecourses/:id',authenticateUser,isAdminOrTeacher,updateCourse)

export default routerCourse