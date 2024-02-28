import { Schema, Types, model } from 'mongoose'
import { IComment, commentSchema } from './comment.model'

export interface IOrchid {
  name: string
  image: string
  price: number
  original: string
  isNatural: boolean
  slug: string
  color: string[]
  comments?: IComment[]
  category: Types.ObjectId
}

const orchidSchema = new Schema<IOrchid>(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    original: { type: String, required: true },
    isNatural: { type: Boolean, required: true, default: false },
    slug: { type: String, required: true },
    color: [String],
    comments: { type: [commentSchema], required: false },
    category: { type: Schema.Types.ObjectId, ref: 'categories', require: true }
  },
  {
    timestamps: true
  }
)

const OrchidModel = model<IOrchid>('orchids', orchidSchema)

export default OrchidModel
