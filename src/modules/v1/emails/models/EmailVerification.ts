import { model, Schema } from 'mongoose';
import {
  IEmailVerificationModel
} from '../../../../domain/interfaces';

const EmailVerificationSchema = new Schema<IEmailVerificationModel>({
  token: {
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
export const EmailVerification = model<IEmailVerificationModel>(
  'EmailVerification',
  EmailVerificationSchema
);

