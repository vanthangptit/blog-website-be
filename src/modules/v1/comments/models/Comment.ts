import { model, Schema } from 'mongoose';
import { ICommentModel } from '../../../../domain/interfaces';

const CommentSchema = new Schema<ICommentModel>({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Post is required'],
  },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'User is required'],
  },
  description: {
    type: String,
    required: [true, 'Comment description is required'],
  },
}, { timestamps: true });

// Compile the comment model
export const Comment = model<ICommentModel>('Comment', CommentSchema);
