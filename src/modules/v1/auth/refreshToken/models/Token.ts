import { model, Schema } from 'mongoose';
import { ITokenModel } from '../../../../../domain/interfaces';

const TokenSchema = new Schema<ITokenModel>({
  refreshToken: {
    type: String,
    trim: true,
  },
  /**
   * @todo Analyst user with user agent and IP address
   */
  ip: {
    type: String,
    required: true,
  },
  userAgent: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please userToken is required'],
  },
}, {
  timestamps: true
});

// Compile the post model
export const Token = model<ITokenModel>('Token', TokenSchema);
