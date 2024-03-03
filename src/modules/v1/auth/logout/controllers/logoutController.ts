import { NextFunction, Request, Response } from 'express';
import { startSession } from 'mongoose';
import { appError, clearCookie } from '../../../../../utils';
import { User } from '../../../users/userModel';
import { deleteRefreshToken } from '../../refreshToken/services/tokenServices';
import { AUTH_COOKIE_NAME } from '../../../../../domain/constants';
import { Token } from '../../refreshToken/models/Token';

export const logoutCtrl = async (
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
      return next(appError('Access Denied. Invalid refresh token', 404));

    await deleteRefreshToken(userId, session);
    await session.commitTransaction();
    await session.endSession();

    clearCookie(res, AUTH_COOKIE_NAME);
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
