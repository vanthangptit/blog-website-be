import { Document, Types } from 'mongoose';

export interface ICommentModel extends Document {
  description: string
  post: Types.ObjectId
  user: Types.ObjectId
}
