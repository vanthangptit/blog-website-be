import { NextFunction, Request, Response } from 'express';

import { appError } from '../../../../utils';
import { IUserModel } from '../../../../domain/interfaces';
import { User } from '../userModel';

/**
 * Get profile
 */
export const userProfileCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: IUserModel | null = await User.findById(req.body.userAuth.id)
      // .select({ password: 0 })
      .populate({
        path: 'posts',
      })
      .populate({
        path: 'comments',
      });
    if (!user)
      return next(appError('User not found', 404));

    user.password = user?.password && user?.password?.length > 0 ? '********': undefined;

    return res.json({
      statusCode: 200,
      message: 'Get profile successfully',
      data: user,
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Who view my profile
 */
export const whoViewMyProfileCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.params.id);
    const userWhoViewed = await User.findById(req.body.userAuth.id);

    if (!user || !userWhoViewed)
      return next(appError('The user or profile can not found', 404));

    const isUserAlreadyViewed = user.viewers.find(
      viewer => viewer.toString() === userWhoViewed._id.toJSON()
    );
    if (isUserAlreadyViewed)
      return next(appError('You already viewed this profile', 400));

    user.viewers.push(userWhoViewed._id);
    await user.save();

    return res.json({
      statusCode: 200,
      message: 'You have successfully viewed this profile',
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};
