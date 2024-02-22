import express from 'express'
import { createUser } from '../controllers/userController.js'

const routerUser=express()

routerUser.post('/createuser',createUser)

export default routerUser