import express from 'express'
import { getAllUsers, getUserById, login, register } from '../controllers/user.controller.js'
import { verifyToken } from '../middleware/verfiyToken.js'
import { allowdTo } from '../middleware/allowedTo.js'

const userRoutes=express.Router()


userRoutes.get('/',verifyToken,allowdTo('admin','manager'),getAllUsers)
userRoutes.get('/:id',verifyToken,allowdTo('admin','manager'),getUserById)
userRoutes.post('/login',verifyToken,login)
userRoutes.post('/register',register)

export default userRoutes