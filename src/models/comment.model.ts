import { ObjectId, Schema, model } from 'mongoose'

export interface IComment {
  rating: number
  comment: string
  author: ObjectId
}

export const commentSchema = new Schema<IComment>(
  {
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'users', require: true }
  },
  {
    timestamps: true
  }
)

const CommentModel = model<IComment>('comments', commentSchema)

export default CommentModel
