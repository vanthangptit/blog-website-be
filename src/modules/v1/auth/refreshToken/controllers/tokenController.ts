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
import {
  IFPayloadToken
} from '../../../../../domain/interfaces/IPayloadToken';
import { AUTH_COOKIE_NAME } from '../../../../../domain/constants';

export const getTokenCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;

  if (!cookies?.jwt)
    return next(appError('Access Denied. No token provided or invalid refresh token', 401));

  const refreshToken = cookies.jwt;
  res.clearCookie(AUTH_COOKIE_NAME, { httpOnly: true, sameSite: 'none', secure: true });

  try {
    const userTokenFound = await Token.findOne({ refreshToken }).exec();
    if (!userTokenFound) {
      const decodedUser: IFPayloadToken | undefined
        = await verifyToken(refreshToken, conf.refreshAccessTokenKey);
      if (!decodedUser)
        return next(appError('Forbidden. Please login again!', 403));

      // Delete refresh tokens of hacked user
      await Token.findOneAndUpdate({ user: decodedUser.id }, {
        refreshToken: null
      }, {
        new: true
      }).exec();

      return next(appError('Forbidden. Please login again!', 403));
    }

    const decodedUser: IFPayloadToken | undefined = await verifyToken(
      userTokenFound.refreshToken,
      conf.refreshAccessTokenKey
    );

    // If expired token or invalid token
    if (!decodedUser || decodedUser.id.toString() !== userTokenFound.user.toString())
      return next(
        appError('Forbidden. Please login again!', 403)
      );

    const {
      accessToken,
      refreshToken: newRefreshToken
    } = generateTokens(userTokenFound.user.toString());

    userTokenFound.refreshToken = newRefreshToken;
    await userTokenFound.save();

    res.cookie(AUTH_COOKIE_NAME, newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000
    });
    return res.json({
      statusCode: 200,
      message: 'Get access token successful',
      data: {
        accessToken,
      },
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
      statusCode: 200,
      message: 'Logged out Successfully',
    });
  } catch (e: any) {
    await session.abortTransaction();
    await session.endSession();
    return next(appError(e.message));
  }
};

