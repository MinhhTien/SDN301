import express from 'express'
import { AuthRoute, Authorization } from '@middlewares'
import { UserRole } from '@common/constant'
import { CommentController } from '@controllers/comment.controller'

const commentRouter = express.Router()
const commentController = new CommentController()

commentRouter.route('/').post(Authorization([UserRole.MEMBER]), commentController.createComment)

export default commentRouter
