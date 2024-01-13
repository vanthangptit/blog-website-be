import { NextFunction, Request, Response } from 'express';

import { Token } from '../models/Token';
import {
  appError,
  clearCookie,
  generateTokens,
  setCookie,
  verifyToken
} from '../../../../../utils';

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
        return next(appError('Access Denied. Invalid token.', 401));

      // Delete refresh tokens of hacked user
      const foundToken = await Token.findOne({ user: decoded.id.toString() });

      if (foundToken) {
        /**
         * @todo: Handle block hacker
         */
        foundToken.refreshToken = [];
        await foundToken.save();
      }

      return next(appError('Unauthorized. Please login again!', 401));
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
        appError('Access Denied. Invalid token.', 401)
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
