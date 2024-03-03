import { model, Schema } from 'mongoose';
import {
  IEmailChangeModel
} from '../../../../domain/interfaces';

const EmailChangeSchema = new Schema<IEmailChangeModel>({
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
export const EmailChange = model<IEmailChangeModel>(
  'EmailChange',
  EmailChangeSchema
);

