import express from 'express'
import { UserController } from '@controllers/user.controller'

const userRouter = express.Router()
const userController = new UserController()

userRouter.route('/login').get(userController.renderLogin).post(userController.login)

userRouter.route('/signup').get(userController.renderSignup).post(userController.signup)

export default userRouter
