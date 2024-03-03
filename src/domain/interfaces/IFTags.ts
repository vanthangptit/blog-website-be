import { Document, Types } from 'mongoose';

export interface IFTagsModel extends Document {
  title: string
  post: Types.ObjectId,
  createdAt: number
  updatedAt: number
}