import { Document, Types } from 'mongoose';
import { IUser } from './IUser';

export interface IToken extends Document {
  refreshToken: string
  ip: string
  userAgent: string
  isValid: boolean
  user: IUser
}
