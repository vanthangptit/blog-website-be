import bcrypt from 'bcryptjs';
import conf from './conf';
import jwt from 'jsonwebtoken';
import { Request } from 'express';

const { lengthHashSalt, accessTokenKey } = conf;

export const passwordHash = (password: string) => {
  const saltRounds = parseInt(lengthHashSalt);
  const salt = bcrypt.genSaltSync(saltRounds);

  return bcrypt.hashSync(password, salt);
};

export const comparePassword = async (passwordReq: string, password: string) => {
  return bcrypt.compareSync(passwordReq, password);
};

export const generateToken = (id: any) => {
  return jwt.sign({ id }, accessTokenKey, { expiresIn: '24h' });
};

export const getTokenFromHeader = async (req: Request) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return null;
  }

  return token;
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, accessTokenKey, (error: any, data: any) => {
    if (error) {
      return false;
    }
    return data;
  });
};

export const appError = (message: string, statusCode?: number) => {
  let error: any = new Error(message);
  error.statusCode = statusCode ? statusCode : 500;
  return error;
};
