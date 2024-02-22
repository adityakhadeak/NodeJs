import express from 'express'
import { createRole } from '../controllers/roleController.js'

const routerRole=express()

routerRole.post('/createrole',createRole)

export default routerRole