import express from 'express'
import { createTeacher } from '../controllers/teacherController.js'

const routerTeacher=express()

routerTeacher.post('/createteacher',createTeacher)

export default routerTeacher