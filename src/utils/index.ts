import bcrypt from 'bcryptjs';
import conf from '../config';
import jwt from 'jsonwebtoken';
import { Request } from 'express';
import {
  IFPayloadToken,
} from '../domain/interfaces/IPayloadToken';

const {
  lengthHashSalt,
  accessTokenKey,
  refreshAccessTokenKey
} = conf;

export const passwordHash = (password: string) => {
  const saltRounds = parseInt(lengthHashSalt);
  const salt = bcrypt.genSaltSync(saltRounds);

  return bcrypt.hashSync(password, salt);
};

export const comparePassword = async (passwordReq: string, password: string) => {
  return bcrypt.compareSync(passwordReq, password);
};

export const generateTokens = (id: string) => {
  const payload: IFPayloadToken = { id };
  const accessToken = jwt.sign(
    payload,
    accessTokenKey,
    { expiresIn: '10m' }
  );
  const refreshToken = jwt.sign(
    payload,
    refreshAccessTokenKey,
    { expiresIn: '1d' }
  );

  return {
    accessToken,
    refreshToken
  }
};

export const getTokenFromHeader = async (req: Request) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return null;
  }
  return token;
};

export const verifyToken = async (token: string, tokenSecretKey: string): Promise<IFPayloadToken | undefined> => {
  try {
    return jwt.verify(token, tokenSecretKey) as IFPayloadToken;
  } catch (e) {
    return;
  }
};

export const appError = (message: string, statusCode?: number) => {
  let error: any = new Error(message);
  error.statusCode = statusCode ? statusCode : 500;
  return error;
};
