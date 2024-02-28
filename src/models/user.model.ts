import { UserRole } from '@common/constant'
import { Schema, model } from 'mongoose'

export interface IUser {
  username: string
  password: string
  role: UserRole
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: UserRole, default: UserRole.MEMBER }
  },
  {
    timestamps: true
  }
)

const UserModel = model<IUser>('users', userSchema)

export default UserModel
