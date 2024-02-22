import express from 'express'
import { createEnrollment } from '../controllers/enrollmentController.js'

const routerEnroll=express()

routerEnroll.post('/createenroll',createEnrollment)

export default routerEnroll