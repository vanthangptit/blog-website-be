import { NextFunction, Request, Response } from 'express';
import { startSession } from 'mongoose';
import {
  comparePassword,
  generateTokens,
  appError,
} from '../../../../../utils';
import { User } from '../../../users/models/User';
import {
  createRefreshToken,
  deleteRefreshToken,
} from '../../refreshToken/services/tokenServices';

export const loginCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const session = await startSession();
  session.startTransaction();

  try {
    const userFound = await User.findOne({ email });
    if (!userFound)
      return next(appError('Email not found', 404));

    const isPasswordMatched = await comparePassword(password, userFound?.password ?? '');
    if (!isPasswordMatched)
      return next(appError('Email or password invalid.', 400));

    const { accessToken, refreshToken } = generateTokens(userFound._id);

    await deleteRefreshToken(userFound._id, session);
    await createRefreshToken(
      userFound._id,
      refreshToken,
      req.headers['user-agent'] ?? '',
      req.ip,
      session
    );
    await session.commitTransaction();
    await session.endSession();

    return res.json({
      status: 200,
      message: 'User logged in Successfully',
      data: {
        user: {
          roles: userFound.roles
        },
        accessToken,
        refreshToken: refreshToken,
      },
    });
  } catch (e: any) {
    await session.abortTransaction();
    await session.endSession();
    return next(appError(e.message));
  }
};
