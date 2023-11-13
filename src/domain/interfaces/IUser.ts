import { Document, Types } from 'mongoose';
import { IPost } from './IPost';

export type Plan = 'free' | 'premium' | 'pro';
export type Gender = 'female' | 'male' | 'other';
export type UserAward = 'bronze' | 'silver' | 'gold';

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  password?: string
  isLoginGoogle?: boolean
  isBlocked?: boolean
  isAdmin: boolean
  emailVerified: boolean
  profilePhoto?: string
  gender?: Gender
  birthDay?: string
  viewers: Types.ObjectId[]
  followers: Types.ObjectId[]
  following: Types.ObjectId[]
  posts: IPost[]
  comments: Types.ObjectId[]
  blocked: Types.ObjectId[]
  plan: Plan
  userAward: UserAward
}
