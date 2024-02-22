import express from 'express'
import { createCourse } from '../controllers/courseController.js'

const routerCourse=express()

routerCourse.post('/createcourse',createCourse)

export default routerCourse