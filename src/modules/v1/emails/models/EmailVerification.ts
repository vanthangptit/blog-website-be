import { model, Schema } from 'mongoose';
import {
  IEmailVerification
} from '../../../../domain/interfaces/IEmail';

const EmailVerificationSchema = new Schema<IEmailVerification>({
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
export const EmailVerification = model<IEmailVerification>(
  'EmailVerification',
  EmailVerificationSchema
);

