import { NextFunction, Request, Response } from 'express';

import {
  appError
} from '../../../../utils';
import { Category } from '../../categories/models/Category';
import { Post } from '../../posts/models/Post';
import { Comment} from '../../comments/models/Comment';
import { User } from '../../users/models/User';

/**
 * Get users
 */
export const adminGetAllUserCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({})
      .select({ password: 0 });
    return res.json({
      statusCode: 200,
      message: 'Get all user successfully',
      data: users,
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Admin block
 */
export const adminBlockUserCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Find the user to be blocked
    const userToBeUnBlocked = await User.findById(req.params.id);
    // 2. Check if user found
    if (!userToBeUnBlocked) {
      return next(appError('AdminBlock::The user can not found', 404));
    }
    //3. Change the isBlocked to true
    userToBeUnBlocked.isBlocked = true;
    //4. Save the user
    await userToBeUnBlocked.save();

    return res.status(200).json({
      message: 'Admin have successfully blocked this user',
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Admin unblock
 */
export const adminUnblockUserCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Find the user to be blocked
    const userToBeUnBlocked = await User.findById(req.params.id);
    // 2. Check if user found
    if (!userToBeUnBlocked) {
      return next(appError('AdminUnblock::The user can not found', 404));
    }
    //3. Change the isBlocked to true
    userToBeUnBlocked.isBlocked = false;
    //4. Save the user
    await userToBeUnBlocked.save();

    return res.status(200).json({
      message: 'Admin have successfully unblocked this user',
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Delete user
 */
export const userDeleteCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userToDelete = await User.findById(req.body.userAuth.id);
    if (!userToDelete)
      return next(appError('User is not exists', 401));

    await Post.deleteMany({ user: req.body.userAuth.id });
    await Comment.deleteMany({ user: req.body.userAuth.id });
    await Category.deleteMany({ user: req.body.userAuth.id });
    await User.findByIdAndDelete(req.body.userAuth.id);

    return res.json({
      statusCode: 200,
      message: 'User deleted successfully',
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};
