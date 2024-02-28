import { Schema, model } from 'mongoose'

export interface ICategory {
  name: string
  description: string
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: false }
  },
  {
    timestamps: true
  }
)

const CategoryModel = model<ICategory>('categories', categorySchema)

export default CategoryModel
