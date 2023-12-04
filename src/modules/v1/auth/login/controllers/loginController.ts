import { NextFunction, Request, Response } from 'express';

import { comparePassword, generateTokens, appError } from '../../../../../utils';
import { User } from '../../../users/models/User';
import { Token } from '../../refreshToken/models/Token';
import { startSession } from 'mongoose';

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
    const userToken = await Token.findOne({ user: userFound._id });

    if (userToken) {
      if (!userToken.isValid)
        return next(appError('Invalid Credentials', 401));
    } else {
      await Token.create([{
        user: userFound._id,
        refreshToken,
        userAgent: req.headers['user-agent'],
        ip: req.ip
      }], { session });
    }

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
        refreshToken: userToken?.refreshToken ?? refreshToken,
      },
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};
