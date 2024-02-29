import { ObjectId, Schema, model } from 'mongoose'

export interface IComment {
  comment: string
  author: ObjectId
  orchid: ObjectId
}

export const commentSchema = new Schema<IComment>(
  {
    comment: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'users', require: true },
    orchid: { type: Schema.Types.ObjectId, ref: 'orchids', require: true }
  },
  {
    timestamps: true
  }
)

const CommentModel = model<IComment>('comments', commentSchema)

export default CommentModel
