import express from 'express'
import { createUser, getUsers, loginUser } from '../controllers/userController.js'
import authenticateUser from '../middlewares/authenticateUser.js'
import { isAdmin } from '../middlewares/authorization.js'

const routerUser=express()

routerUser.post('/createuser',createUser)

routerUser.post('/loginuser',loginUser)

routerUser.get('/getusers',authenticateUser,isAdmin,getUsers)

export default routerUser