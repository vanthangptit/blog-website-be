import { NextFunction, Request, Response } from 'express';

import {appError, generateTokens, verifyToken} from '../../../../../utils';
import { Token } from '../models/Token';
import conf from '../../../../../config';

export const getTokenCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken, userId } = req.body;

  try {
    const userTokenFound = await Token.findOne({ refreshToken, user: userId });
    if (!userTokenFound || !userTokenFound.isValid)
      return next(appError('Access Denied. No token provided or invalid refresh token', 401));

    const token: any = await verifyToken(
      userTokenFound.refreshToken,
      conf.refreshAccessTokenKey
    );

    if (!token)
      return next(
        appError('Forbidden. Please login again!', 403)
      );

    const { accessToken } = generateTokens(userTokenFound.user);

    return res.json({
      status: 200,
      message: 'User logged in successful',
      accessToken
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

export const deleteTokenCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken, userId } = req.body;

  try {
    const userTokenFound = await Token.findOne({ refreshToken, user: userId });
    if (!userTokenFound)
      return next(appError('Access Denied. Invalid refresh token', 401));

    await Token.deleteMany({ refreshToken, user: userId });

    return res.json({
      status: 200,
      message: 'Logged out Successfully',
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

