import express, { NextFunction, Request, Response } from 'express'
import { CategoryController } from '@controllers/category.controller'

const categoryRouter = express.Router()
const categoryController = new CategoryController()

categoryRouter.route('/').get(categoryController.getAllCategories).post(categoryController.createCategory)

categoryRouter
  .route('/:id')
  .get(categoryController.getCategoryById)
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory)

export default categoryRouter
