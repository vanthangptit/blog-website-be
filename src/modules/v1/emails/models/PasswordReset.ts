import { model, Schema } from 'mongoose';
import {
  IPasswordReset
} from '../../../../domain/interfaces/IEmail';

const PasswordResetSchema = new Schema<IPasswordReset>({
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
export const PasswordReset = model<IPasswordReset>(
  'PasswordReset',
  PasswordResetSchema
);
