import { NextFunction, Request, Response } from 'express';

import {
  comparePassword,
  generateToken,
  appError
} from '../../../../utils';
import { User } from '../../users/models/User';

export const loginCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!password || !password?.length|| !userFound)
      return next(appError('Invalid login credentials', 401));

    const isPasswordMatched = await comparePassword(password, userFound?.password ?? '');
    if (!isPasswordMatched)
      return next(appError('Invalid login credentials', 401));

    /** @todo
     * Use csrf middleware to routing
     * Reference: https://www.geeksforgeeks.org/implementing-csurf-middleware-in-node-js/
     **/

    return res.json({
      status: 200,
      message: 'User logged in successful',
      data: {
        firstName: userFound.firstName,
        lastName: userFound.lastName,
        profilePhoto: userFound.profilePhoto,
        isAdmin: userFound.isAdmin,
        isBlocked: userFound.isBlocked,
        accessToken: generateToken(userFound._id)
      },
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};
