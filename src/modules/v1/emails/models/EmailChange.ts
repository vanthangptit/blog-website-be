import { model, Schema } from 'mongoose';
import {
  IEmailChange
} from '../../../../domain/interfaces/IEmail';

const EmailChangeSchema = new Schema<IEmailChange>({
  token: {
    type: String,
    required: true,
  },
  newEmail: {
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
export const EmailChange = model<IEmailChange>(
  'EmailChange',
  EmailChangeSchema
);

