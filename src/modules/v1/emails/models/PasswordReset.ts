import { model, Schema } from 'mongoose';
import {
  IPasswordResetModel
} from '../../../../domain/interfaces';

const PasswordResetSchema = new Schema<IPasswordResetModel>({
  code: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  validUntil: {
    type: Date,
    required: true,
  }
});

// Compile the user model
export const PasswordReset = model<IPasswordResetModel>(
  'PasswordReset',
  PasswordResetSchema
);
