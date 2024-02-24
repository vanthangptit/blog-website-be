import { model, Schema } from 'mongoose';
import { IFTagsModel } from '../../../../domain/interfaces/IFTags';

const TagSchema = new Schema<IFTagsModel>({
  title: {
    type: String,
    required: [true, 'Tag description is required'],
    trim: true,
    unique: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Post id is required'],
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
});

// Compile the post model
export const Tag = model<IFTagsModel>('Tag', TagSchema);
