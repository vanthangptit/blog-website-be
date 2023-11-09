import { Document, Types } from 'mongoose';

export interface ICategory extends Document {
  title: string
  user: Types.ObjectId
  createdAt: number
  updatedAt: number
}
