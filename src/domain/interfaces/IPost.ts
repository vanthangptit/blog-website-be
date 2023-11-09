import { Document, Types } from 'mongoose';
import { IUser } from './IUser';

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

export interface IPost extends Document {
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
  user: IUser,
  createdAt: number
  updatedAt: number
}
