import { Document, Types } from 'mongoose';

export interface ICategoryModel extends Document {
  title: string
  user: Types.ObjectId
  createdAt: number
  updatedAt: number
}
