import express from 'express'
import { createCourse, getCourses } from '../controllers/courseController.js'
import authenticateUser from '../middlewares/authenticateUser.js'
import { isAdmin, isStudent } from '../middlewares/authorization.js'

const routerCourse=express()

routerCourse.post('/createcourse',createCourse)

routerCourse.get('/getcourses',authenticateUser,isAdmin,isStudent,getCourses)

export default routerCourse