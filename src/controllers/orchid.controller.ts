import { NextFunction, Request, Response } from 'express'
import formidable, { Fields } from 'formidable'
import httpStatus from 'http-status'
import OrchidModel, { IOrchid } from '@models/orchid.model'
import { createSlug, convertStringToColorArray } from '@utils/common'
import { MongoServerError } from 'mongodb'
import CategoryModel, { ICategory } from '@models/category.model'
import { get } from 'lodash'
import CommentModel from '@models/comment.model'
import { UserRole } from '@common/constant'

export class OrchidController {
  async renderAllOrchids(req: any, res: Response, next: NextFunction) {
    try {
      const orchids = await OrchidModel.find(
        {},
        {},
        {
          populate: 'category'
        }
      ).lean()
      const user = req.session.user
      res.render('./orchids/all', {
        orchids,
        search: 'Search Orchids...',
        isLoggedIn: !!user,
        user: req.session.user
      })
    } catch (err: any) {
      res.render('404', {
        isLoggedIn: !!req.session.user,
        user: req.session.user
      })
    }
  }

  async searchOrchids(req: any, res: Response, next: NextFunction) {
    try {
      console.log(req.body)
      const orchids = await OrchidModel.find(
        {
          name: { $regex: req.body.search, $options: 'i' }
        },
        {},
        {
          populate: 'category'
        }
      ).lean()
      res.render('./orchids/all', {
        orchids,
        search: req.body.search,
        isLoggedIn: !!req.session.user,
        user: req.session.user
      })
    } catch (err: any) {
      res.render('404', {
        isLoggedIn: !!req.session.user,
        user: req.session.user
      })
    }
  }

  async renderManagementOrchids(req: any, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryModel.find({}).lean()
      let orchids = await OrchidModel.find(
        {},
        {},
        {
          populate: 'category'
        }
      ).lean()
      orchids = orchids.map((orchid: any) => {
        orchid['categories'] = categories
        return orchid
      })
      res.render('./orchids/management', {
        orchids,
        categories,
        isLoggedIn: !!req.session.user,
        user: req.session.user
      })
    } catch (err: any) {
      res.render('404', {
        isLoggedIn: !!req.session.user,
        user: req.session.user
      })
    }
  }

  async getOrchidById(req: any, res: Response) {
    try {
      const orchid = await OrchidModel.findOne(
        { slug: req.params?.orchidSlug },
        {},
        {
          populate: ['category', 'comments.author']
        }
      )
      const comment = await CommentModel.findOne({
        orchid: orchid?._id,
        author: req.session.user?._id
      })
      if (!orchid) {
        res.render('404', {
          isLoggedIn: !!req.session.user,
          user: req.session.user
        })
        return
      }
      res.render('./orchids/detail', {
        _id: orchid._id,
        name: orchid.name,
        price: orchid.price,
        image: orchid.image,
        original: orchid.original,
        isNatural: orchid.isNatural,
        color: orchid.color,
        slug: orchid.slug,
        comments: orchid.comments?.map((comment: any) => comment.toJSON()),
        commentCount: orchid.comments?.length,
        categoryName: get(orchid, 'category.name'),
        isLoggedIn: !!req.session.user,
        user: req.session.user,
        canComment: req.session.user?.role === UserRole.MEMBER && !comment
      })
    } catch (err: any) {
      console.log(err)
      res.render('404', {
        isLoggedIn: !!req.session.user,
        user: req.session.user
      })
    }
  }

  async createOrchid(req: any, res: Response, next: NextFunction) {
    try {
      const orchid = req.body
      const colorList = convertStringToColorArray(orchid.color)
      const isNatural = 'isNatural' in orchid

      const category = await CategoryModel.findById(orchid.categoryId)
      if (category === null) {
        return res.render('400', {
          errorMessage: `Category not existed. Please try again!`,
          isLoggedIn: !!req.session.user,
          user: req.session.user
        })
      }

      const newOrchid: IOrchid = {
        name: orchid.name,
        image: orchid.image,
        original: orchid.original,
        isNatural: isNatural,
        color: colorList,
        price: orchid.price,
        slug: createSlug(orchid.name),
        category: category._id
      }
      await OrchidModel.create(newOrchid)
      return res.status(httpStatus.CREATED).redirect('/orchids/management')
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        const { code, keyPattern, keyValue } = err
        if (code === 11000 && keyPattern['name'] === 1) {
          res.render('400', {
            errorMessage: `Orchid name : ${keyValue['name']} has existed. Please try another name!`,
            isLoggedIn: !!req.session.user,
            user: req.session.user
          })
        }
      }
      console.error(err)
      res.render('404', {
        isLoggedIn: !!req.session.user,
        user: req.session.user
      })
    }
  }

  async updateOrchid(req: any, res: Response, next: NextFunction) {
    try {
      const form = formidable({})
      form.parse(req, async (err, fields: Fields) => {
        if (err) {
          return
        }
        const isNatural = 'isNatural' in fields
        const colorList = convertStringToColorArray(fields.color![0])
        const category = await CategoryModel.findById(fields.categoryId![0])
        if (category === null) {
          return res.render('400', {
            errorMessage: `Category not existed. Please try again!`,
            isLoggedIn: !!req.session.user,
            user: req.session.user
          })
        }

        const newOrchid: IOrchid = {
          name: fields.name![0],
          image: fields.image![0],
          original: fields.original![0],
          isNatural: isNatural,
          color: colorList,
          price: Number(fields.price![0]),
          slug: createSlug(fields.name![0]),
          category: category._id
        }
        const orchid = await OrchidModel.findByIdAndUpdate(req.params.id, newOrchid).lean().exec()

        if (!orchid) {
          res.status(httpStatus.NOT_FOUND).render('404', {
            isLoggedIn: !!req.session.user,
            user: req.session.user
          })
        } else {
          const orchids = await OrchidModel.find({}).lean()
          res.status(httpStatus.OK).render('./orchids/management', {
            orchids,
            isLoggedIn: !!req.session.user,
            user: req.session.user
          })
        }
      })
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        const { code, keyPattern, keyValue } = err
        if (code === 11000 && keyPattern['name'] === 1) {
          res.render('400', {
            errorMessage: `Orchid name : ${keyValue['name']} has existed. Please try another name!`,
            isLoggedIn: !!req.session.user,
            user: req.session.user
          })
        }
      }
      console.error(err)
      res.render('404', {
        isLoggedIn: !!req.session.user,
        user: req.session.user
      })
    }
  }

  async deleteOrchid(req: any, res: Response) {
    try {
      const orchid = await OrchidModel.findByIdAndDelete(req.params.id).lean().exec()
      if (!orchid) {
        res.status(httpStatus.NOT_FOUND).render('404', {
          isLoggedIn: !!req.session.user,
          user: req.session.user
        })
      }
    } catch (err: any) {
      res.render('404', {
        isLoggedIn: !!req.session.user,
        user: req.session.user
      })
    }
  }
}
