import bcrypt from 'bcryptjs';
import conf from '../config';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { IFPayloadToken } from '../domain/interfaces';
import { NameCookies } from '../domain/interfaces/IFCookie';

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

export const setCookie = (
  res: Response,
  nameCookie: NameCookies,
  valueCookie: any
): void => {
  res.cookie(`${nameCookie}`, valueCookie, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000
  });
};

export const clearCookie = (
  res: Response,
  nameCookie: NameCookies
): void => {
  res.clearCookie(`${nameCookie}`, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });
};
