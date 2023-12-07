import { Document, Types } from 'mongoose';
import { IUserModel } from './IUser';

export type PostType =
  'society' |
  'sports' |
  'technology' |
  'traveling' |
  'history' |
  'learn' |
  'lovely' |
  'poem' |
  'review' |
  'life' |
  'diary';

export interface IPostModel extends Document {
  title: string
  excerpt: string
  description: string
  imageUrl: string
  shortUrl: string
  postType: PostType
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
