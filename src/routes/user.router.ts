import express from 'express'
import { UserController } from '@controllers/user.controller'
import { AuthRoute, Authorization } from '@middlewares'
import { UserRole } from '@common/constant'

const userRouter = express.Router()
const userController = new UserController()

userRouter.route('/login').get(AuthRoute, userController.renderLogin).post(userController.login)

userRouter.route('/signup').get(AuthRoute, userController.renderSignup).post(userController.signup)

userRouter.route('/logout').get(AuthRoute, userController.logout)

userRouter.route('/accounts').get(Authorization([UserRole.ADMIN]), userController.renderAllAccounts)

export default userRouter
