import { Document } from 'mongoose';
import { IUserModel } from './IUser';

export interface ITokenModel extends Document {
  refreshToken: string
  ip: string
  userAgent: string
  user: IUserModel
}
