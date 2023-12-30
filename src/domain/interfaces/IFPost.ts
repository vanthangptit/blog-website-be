import { Document, Types } from 'mongoose';
import { IUserModel } from './IUser';

export interface IPostModel extends Document {
  title: string
  excerpt: string
  description: string
  imageUrl: string
  shortUrl: string
  writer: string
  isPublished: boolean
  category: Types.ObjectId
  comments: Types.ObjectId[]
  numViews: Types.ObjectId[]
  likes: Types.ObjectId[]
  disLikes: Types.ObjectId[]
  user: IUserModel,
  createdAt: number
  updatedAt: number
}
