import { Document, Types } from 'mongoose';

export interface IComment extends Document {
  description: string
  post: Types.ObjectId
  user: Types.ObjectId
}
