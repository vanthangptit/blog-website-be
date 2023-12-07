import { NextFunction, Request, Response } from 'express';
import { startSession } from 'mongoose';
import {
  comparePassword,
  generateTokens,
  appError,
  setCookie,
} from '../../../../../utils';
import { User } from '../../../users/models/User';
import {
  createRefreshToken,
  deleteRefreshToken,
} from '../../refreshToken/services/tokenServices';
import { AUTH_COOKIE_NAME } from '../../../../../domain/constants';

export const loginCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const session = await startSession();
  session.startTransaction();

  try {
    const userFound = await User.findOne({ email }).exec();
    if (!userFound)
      return next(appError('Email not found', 404));

    const isPasswordMatched = await comparePassword(password, userFound?.password ?? '');
    if (!isPasswordMatched)
      return next(appError('Email or password invalid.', 400));

    const {
      accessToken,
      refreshToken: newRefreshToken
    } = generateTokens(userFound._id.toString());

    await deleteRefreshToken(userFound._id, session);
    await createRefreshToken(
      userFound._id,
      newRefreshToken,
      req.headers['user-agent'] ?? '',
      req.ip,
      session
    );
    await session.commitTransaction();
    await session.endSession();

    setCookie(res, AUTH_COOKIE_NAME, newRefreshToken);
    return res.json({
      statusCode: 200,
      message: 'User logged in Successfully',
      data: {
        user: {
          roles: userFound.roles
        },
        accessToken,
      },
    });
  } catch (e: any) {
    await session.abortTransaction();
    await session.endSession();
    return next(appError(e.message));
  }
};
