import { Document, Types } from 'mongoose';

export interface ICategoryModel extends Document {
  title: string
  image: string
  user: Types.ObjectId
  createdAt: number
  updatedAt: number
}
