import express from 'express'
import { createStudent } from '../controllers/studentController.js'

const routerStudent=express()

routerStudent.post('/createstudent',createStudent)

export default routerStudent