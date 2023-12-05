import { model, Schema } from 'mongoose';
import { IToken } from '../../../../../domain/interfaces';

const TokenSchema = new Schema<IToken>({
  refreshToken: {
    type: String,
    required: true,
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
export const Token = model<IToken>('Token', TokenSchema);
