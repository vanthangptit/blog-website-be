import { Document, Types } from 'mongoose';

export interface IEmailVerification extends Document {
  token: string
  user: Types.ObjectId
  validUntil: Date
}

export interface IEmailChange extends Document {
  token: string
  newEmail: string
  user: Types.ObjectId
  validUntil: Date
}

export interface IPasswordReset extends Document {
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
