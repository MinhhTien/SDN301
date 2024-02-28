import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import CategoryModel from '@models/category.model'

export interface IResponse {
  message?: string
  data: object
}

export class CategoryController {
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryModel.find({}).lean().exec()
      const response: IResponse = {
        data: categories
      }
      res.status(httpStatus.OK).json(response)
    } catch (err: any) {
      next(err)
    }
  }

  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryModel.findById(req.params.id).lean().exec()
      let status
      let response: IResponse
      if (!category) {
        response = {
          message: `Category not found!`,
          data: {}
        }
        status = httpStatus.NOT_FOUND
      } else {
        response = {
          message: 'Data found',
          data: category
        }
        status = httpStatus.OK
      }
      res.status(status).json(response)
    } catch (err: any) {
      next(err)
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.body
      let status
      let response: IResponse
      if (!Object.keys(category).length) {
        response = {
          message: `Invalid body payload!`,
          data: {}
        }
        status = httpStatus.BAD_REQUEST
      } else {
        const newCategory = await CategoryModel.create(category)
        status = httpStatus.CREATED
        response = {
          message: `Category is created!`,
          data: newCategory
        }
        status = httpStatus.CREATED
      }
      res.status(status).json(response)
    } catch (err: any) {
      next(err)
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      let status
      let response: IResponse
      const category = req.body
      if (!Object.keys(category).length) {
        response = {
          message: `Body required`,
          data: {}
        }
        status = httpStatus.BAD_REQUEST
      } else {
        const updatedCategory = await CategoryModel.findByIdAndUpdate(req.params.id, category, { new: true })
          .lean()
          .exec()
        if (!updatedCategory) {
          response = {
            message: `Category not found!`,
            data: {}
          }
          status = httpStatus.NOT_FOUND
        } else {
          response = {
            message: 'Category is updated',
            data: updatedCategory
          }
          status = httpStatus.OK
        }
      }
      res.status(status).json(response)
    } catch (err: any) {
      next(err)
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryModel.findByIdAndDelete(req.params.id).lean().exec()
      let status
      let response: IResponse
      if (!category) {
        response = {
          message: `Category not found!`,
          data: {}
        }
        status = httpStatus.NOT_FOUND
      } else {
        response = {
          message: 'Category is deleted',
          data: category
        }
        status = httpStatus.OK
      }
      res.status(status).json(response)
    } catch (err: any) {
      next(err)
    }
  }
}
