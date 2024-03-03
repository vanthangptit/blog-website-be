import { NextFunction, Request, Response } from 'express';

import { appError } from '../../../../utils';
import { User } from '../userModel';

/**
 * Block user
 */
export const blockUserCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userToBeBlocked = await User.findById(req.params.id);
    const userWhoBlocked = await User.findById(req.body.userAuth.id);

    if (!userToBeBlocked || !userWhoBlocked)
      return next(appError('blockUser::The user can not found', 404));

    const isUserAlreadyBlocked = userWhoBlocked.blocked.find(
      blocker => blocker.toString() === userToBeBlocked._id.toJSON()
    );
    if (isUserAlreadyBlocked)
      return next(appError('You already blocked this profile', 400));

    userWhoBlocked.blocked.push(userWhoBlocked._id);
    await userWhoBlocked.save();

    return res.json({
      statusCode: 200,
      message: 'You have successfully blocked this profile',
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};


/**
 * Unblock user
 */
export const unblockUserCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userToBeUnBlocked = await User.findById(req.params.id);
    const userWhoUnBlocked = await User.findById(req.body.userAuth.id);

    if (!userToBeUnBlocked || !userWhoUnBlocked)
      return next(appError('Unblock::The user can not found', 404));

    const isUserAlreadyBlocked = userWhoUnBlocked.blocked.find(
      blocker => blocker.toString() === userToBeUnBlocked._id.toJSON()
    );
    if (isUserAlreadyBlocked)
      return next(appError('You already unblocked this user', 400));

    userWhoUnBlocked.blocked = userWhoUnBlocked.blocked.filter(
      blocker => blocker.toString() !== userToBeUnBlocked._id.toJSON()
    );
    await userWhoUnBlocked.save();

    return res.json({
      statusCode: 200,
      message: 'You have successfully unblocked this user',
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};