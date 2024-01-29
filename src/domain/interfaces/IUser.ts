import { Document, Types } from 'mongoose';
import { IPostModel } from './IFPost';

export type Plan = 'free' | 'premium' | 'pro';
export type Gender = 'female' | 'male' | 'other';
export type UserAward = 'bronze' | 'silver' | 'gold';
export type Roles = 'normal' | 'creator' | 'admin';

export interface IUserModel extends Document {
  firstName: string
  lastName: string
  email: string
  password?: string
  isLoginGoogle?: boolean
  isBlocked?: boolean
  isAdmin: boolean
  description?: string
  address?: string
  job?: string
  school?: string
  alias?: string
  emailVerified: boolean
  profilePhoto?: string
  gender?: Gender
  birthDay?: string
  viewers: Types.ObjectId[]
  followers: Types.ObjectId[]
  following: Types.ObjectId[]
  posts: IPostModel[]
  comments: Types.ObjectId[]
  blocked: Types.ObjectId[]
  plan: Plan
  userAward: UserAward
  roles: Roles
}
