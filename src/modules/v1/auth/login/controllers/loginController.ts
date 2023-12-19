import { NextFunction, Request, Response } from 'express';
import { startSession } from 'mongoose';
import {
  comparePassword,
  generateTokens,
  appError,
  setCookie,
  clearCookie,
} from '../../../../../utils';
import { User } from '../../../users/models/User';
import {
  createRefreshToken,
} from '../../refreshToken/services/tokenServices';
import { AUTH_COOKIE_NAME } from '../../../../../domain/constants';
import { Token } from '../../refreshToken/models/Token';

export const loginCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;
  const { email, password } = req.body;
  const session = await startSession();
  session.startTransaction();

  try {
    const userFound: any = await User.findOne({ email }).exec();
    if (!userFound)
      return next(appError('Email not found', 404));

    const isPasswordMatched = await comparePassword(password, userFound?.password ?? '');
    if (!isPasswordMatched)
      return next(appError('Email or password invalid.', 400));

    const {
      accessToken,
      refreshToken: newRefreshToken
    } = generateTokens(userFound._id.toString());

    const userTokenFound = await Token.findOne({ user: userFound._id });
    if (userTokenFound) {
      let newRefreshTokenArray = !cookies.authToken
        ? userTokenFound.refreshToken
        : userTokenFound.refreshToken.filter(rt => rt !== cookies.authToken);

      if (cookies?.authToken) {
        /*
          Scenario added here:
            1) User logs in but never uses RT and does not logout
            2) RT is stolen
            3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
        */
        const refreshToken = cookies.authToken;
        const foundToken = await Token.findOne({ refreshToken });

        // Detected refresh token reuse!
        if (!foundToken) {
          newRefreshTokenArray = []; // clear out ALL previous refresh tokens
        }

        clearCookie(res, AUTH_COOKIE_NAME);
      }

      userTokenFound.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      await userTokenFound.save();
    } else {
      await createRefreshToken(
        userFound._id,
        [ newRefreshToken ],
        req.headers['user-agent'] ?? '',
        req.ip,
        session
      );
    }

    await session.commitTransaction();
    await session.endSession();

    setCookie(res, AUTH_COOKIE_NAME, newRefreshToken);
    return res.json({
      statusCode: 200,
      message: 'User logged in Successfully',
      user: {
        roles: userFound.roles,
        fullName: userFound.fullName
      },
      accessToken,
    });
  } catch (e: any) {
    await session.abortTransaction();
    await session.endSession();
    return next(appError(e.message));
  }
};
