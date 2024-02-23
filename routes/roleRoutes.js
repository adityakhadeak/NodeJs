import express from 'express'
import { createRole, getRoles } from '../controllers/roleController.js'
import { isAdmin } from '../middlewares/authorization.js'
import authenticateUser from '../middlewares/authenticateUser.js'

const routerRole=express()

routerRole.post('/createrole',authenticateUser,isAdmin,createRole)

routerRole.get('/getroles',authenticateUser,isAdmin,getRoles)

export default routerRole