import express, { NextFunction, Request, Response } from 'express'
import { CategoryController } from '@controllers/category.controller'
import { Authorization } from '@middlewares'
import { UserRole } from '@common/constant'

const categoryRouter = express.Router()
const categoryController = new CategoryController()

categoryRouter
  .route('/')
  .get(categoryController.getAllCategories)
  .post(Authorization([UserRole.ADMIN]), categoryController.createCategory)

categoryRouter
  .route('/:id')
  .get(categoryController.getCategoryById)
  .put(Authorization([UserRole.ADMIN]), categoryController.updateCategory)
  .delete(Authorization([UserRole.ADMIN]), categoryController.deleteCategory)

export default categoryRouter
