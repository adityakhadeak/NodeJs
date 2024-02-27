import express from 'express'
import { createUser, deleteUser, getUsers, loginUser, updateUserLoginDetails } from '../controllers/userController.js'
import authenticateUser from '../middlewares/authenticateUser.js'
import { isAdmin } from '../middlewares/authorization.js'

const routerUser=express()

routerUser.post('/createuser',createUser)

routerUser.post('/loginuser',loginUser)

routerUser.get('/getusers',authenticateUser,isAdmin,getUsers)

routerUser.put('/updatelogindetails/:user_id',authenticateUser,updateUserLoginDetails)

routerUser.delete('/deleteuser/:user_id',authenticateUser,deleteUser)

export default routerUser