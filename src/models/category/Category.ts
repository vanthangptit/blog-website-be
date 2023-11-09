import { model, Schema } from 'mongoose';
import { ICategory } from '../../domain/interfaces';

const CategorySchema = new Schema<ICategory>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  title: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Compile the category model
export const Category = model<ICategory>('Category', CategorySchema);
