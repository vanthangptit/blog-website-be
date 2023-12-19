import { NextFunction, Request, Response } from 'express';
import { startSession } from 'mongoose';

import { Token } from '../models/Token';
import { User } from '../../../users/models/User';
import {
  appError,
  clearCookie,
  generateTokens,
  setCookie,
  verifyToken
} from '../../../../../utils';
import { deleteRefreshToken } from '../services/tokenServices';

import conf from '../../../../../config';
import {
  IFPayloadToken
} from '../../../../../domain/interfaces';
import { AUTH_COOKIE_NAME } from '../../../../../domain/constants';

export const getTokenCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;

  if (!cookies?.authToken)
    return next(
      appError(
      'Access Denied. No token provided or invalid refresh token',
      401
      )
    );

  const refreshToken = cookies.authToken;
  clearCookie(res, AUTH_COOKIE_NAME);

  try {
    const userTokenFound = await Token.findOne({ refreshToken });

    if (!userTokenFound) {
      const decoded: IFPayloadToken | undefined
        = await verifyToken(refreshToken, conf.refreshAccessTokenKey);
      if (!decoded)
        return next(appError('Forbidden. Please login again!', 403));

      // Delete refresh tokens of hacked user
      const foundToken = await Token.findOne({ user: decoded.id.toString() });

      if (foundToken) {
        /**
         * @todo: Handle block hacker
         */
        foundToken.refreshToken = [];
        await foundToken.save();
      }

      return next(appError('Forbidden. Please login again!', 403));
    }

    const decodedUser: IFPayloadToken | undefined = await verifyToken(
      refreshToken,
      conf.refreshAccessTokenKey
    );
    const newRefreshTokenArray = userTokenFound.refreshToken.filter(rt => rt !== refreshToken);

    // If expired token or invalid token
    if (!decodedUser || decodedUser.id.toString() !== userTokenFound.user.toString()) {
      userTokenFound.refreshToken = [...newRefreshTokenArray];
      const result = await userTokenFound.save();
      return next(
        appError('Forbidden. Please login again!', 403)
      );
    }

    const {
      accessToken,
      refreshToken: newRefreshToken
    } = generateTokens(userTokenFound.user.toString());

    // Saving refreshToken with current user
    userTokenFound.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    await userTokenFound.save();

    setCookie(res, AUTH_COOKIE_NAME, newRefreshToken);
    return res.json({
      statusCode: 200,
      message: 'Get access token successful',
      accessToken,
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

