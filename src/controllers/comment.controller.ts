import { Response } from 'express'
import CommentModel from '@models/comment.model'
import OrchidModel from '@models/orchid.model'

export class CommentController {
  async createComment(req: any, res: Response) {
    try {
      const user = req.session.user
      const { orchidId, comment } = req.body
      const commentDoc = await CommentModel.findOne({
        author: user?._id,
        orchid: orchidId
      }).lean()
      if (commentDoc) {
        return res.render('400', {
          errorMessage: `You have commented this orchid before.`,
          isLoggedIn: !!req.session.user,
          user: req.session.user
        })
      }
      const commentDocument = await CommentModel.create({
        comment,
        author: user?._id,
        orchid: orchidId
      })
      console.log(commentDocument.toObject())
      const orchid = await OrchidModel.findById(orchidId)
      orchid?.comments?.push(commentDocument)
      orchid?.save()
      return res.redirect(`/orchids/${orchid?.slug}`)
    } catch (err: any) {
      console.error(err)
      res.render('404', {
        isLoggedIn: !!req.session.user,
        user: req.session.user
      })
    }
  }
}
