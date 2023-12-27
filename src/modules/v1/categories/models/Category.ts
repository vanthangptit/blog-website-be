import { model, Schema } from 'mongoose';
import { ICategoryModel } from '../../../../domain/interfaces';

const CategorySchema = new Schema<ICategoryModel>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Compile the category model
export const Category = model<ICategoryModel>('Category', CategorySchema);
