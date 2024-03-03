import { Document, Types } from 'mongoose';

export interface IEmailVerificationModel extends Document {
  token: string
  user: Types.ObjectId
  validUntil: Date
}

export interface IEmailChangeModel extends Document {
  token: string
  newEmail: string
  user: Types.ObjectId
  validUntil: Date
}

export interface IPasswordResetModel extends Document {
  code: string
  user: Types.ObjectId
  validUntil: Date
}

export interface IMailOptions {
  from: string,
  to: string,
  subject: string,
  html: string,
}
