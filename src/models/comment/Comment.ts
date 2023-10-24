import {
  model,
  Schema,
  Model,
  Types,
  Document,
  HydratedDocument
} from 'mongoose';

export interface IComment extends Document {
  description: string
  post: Types.ObjectId
  user: any
}

const CommentSchema = new Schema<IComment>({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Post is required'],
  },
  user: {
    type: Object,
    required: [true, 'Please is required'],
  },
  description: {
    type: String,
    required: [true, 'Comment description is required'],
  },
}, { timestamps: true });

// Compile the comment model
export const Comment = model<IComment>('Comment', CommentSchema);
