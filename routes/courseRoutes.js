import express from 'express'
import { createCourse, deleteCourse, getCourses, updateCourse } from '../controllers/courseController.js'
import authenticateUser from '../middlewares/authenticateUser.js'
import { isAdmin, isAdminOrStudent, isAdminOrTeacher, isStudent } from '../middlewares/authorization.js'

const routerCourse=express()

routerCourse.post('/createcourse',createCourse)

routerCourse.get('/getcourses',authenticateUser,isAdminOrStudent,getCourses)

routerCourse.put('/updatecourses/:course_id',authenticateUser,isAdminOrTeacher,updateCourse)

routerCourse.delete('/deletecourse/:course_id',authenticateUser,isAdminOrTeacher,deleteCourse)

export default routerCourse