import {
  model,
  Schema,
  Model,
  Types,
  Document,
  HydratedDocument
} from 'mongoose';

export interface ICategory extends Document {
  title: string
  user: Types.ObjectId
  createdAt: number
  updatedAt: number
}

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
