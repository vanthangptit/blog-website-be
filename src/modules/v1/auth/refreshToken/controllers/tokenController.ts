import { NextFunction, Request, Response } from 'express';
import { startSession } from 'mongoose';

import { Token } from '../models/Token';
import { User } from '../../../users/models/User';
import {
  appError,
  generateTokens,
  verifyToken
} from '../../../../../utils';
import { deleteRefreshToken } from '../services/tokenServices';

import conf from '../../../../../config';

export const getTokenCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken, userId } = req.body;

  try {
    const userTokenFound = await Token.findOne({ refreshToken, user: userId });
    const userFound = await User.findById(userId);
    if (!userTokenFound || !userFound)
      return next(appError('Access Denied. No token provided or invalid refresh token', 401));

    const token: any = await verifyToken(
      userTokenFound.refreshToken,
      conf.refreshAccessTokenKey
    );

    // If expired token. User must have login again
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
  const session = await startSession();
  session.startTransaction();

  try {
    const userTokenFound = await Token.findOne({ refreshToken, user: userId });
    const userFound = await User.findById(userId);

    if (!userTokenFound || !userFound)
      return next(appError('Access Denied. Invalid refresh token', 401));

    await deleteRefreshToken(userId, session);
    await session.commitTransaction();
    await session.endSession();

    return res.json({
      status: 200,
      message: 'Logged out Successfully',
    });
  } catch (e: any) {
    await session.abortTransaction();
    await session.endSession();
    return next(appError(e.message));
  }
};

