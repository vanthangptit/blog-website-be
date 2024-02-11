import { NextFunction, Request, Response } from 'express';

import { appError } from '../../../../utils';
import { startSession } from 'mongoose';
import { User } from '../userModel';

/**
 * Following
 */
export const followingCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await startSession();
  session.startTransaction();

  try {
    const userToFollow = await User.findById(req.params.id);
    const userWhoFollowed = await User.findById(req.body.userAuth.id);

    if (!userToFollow || !userWhoFollowed) {
      return next(appError('The user or profile can not found', 404));
    }

    const isUserAlreadyFollowed = userToFollow.followers.find(
      follower => follower.toString() === userWhoFollowed._id.toJSON()
    );

    if (isUserAlreadyFollowed) {
      return next(appError('You already followed this user', 400));
    }

    // "Followers" are the users who follow you.
    userToFollow.followers.push(userWhoFollowed._id);
    // “Following” is the term for the users who you follow.
    userWhoFollowed.following.push(userToFollow._id);

    await userToFollow.save();
    await userWhoFollowed.save();

    await session.commitTransaction();
    await session.endSession();
    return res.json({
      statusCode: 200,
      message: 'You have successfully followed this user',
    });
  } catch (e: any) {
    await session.abortTransaction();
    await session.endSession();
    return next(appError(e.message));
  }
};

/**
 * unFollow
 */
export const unfollowCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await startSession();
  session.startTransaction();
  try {
    const userToBeUnfollowed = await User.findById(req.params.id);
    const userWhoUnFollowed = await User.findById(req.body.userAuth.id);

    if (!userToBeUnfollowed || !userWhoUnFollowed) {
      return next(appError('The follower or following can not found', 404));
    }

    const isUserAlreadyFollowed = userToBeUnfollowed.followers.find(
      follower => follower.toString() === userWhoUnFollowed._id.toJSON()
    );
    if (!isUserAlreadyFollowed) {
      return next(appError('You have not followed this user', 400));
    }

    userToBeUnfollowed.followers = userToBeUnfollowed.followers.filter(
      follower => follower.toString() !== userWhoUnFollowed._id.toJSON()
    );
    await userToBeUnfollowed.save();
    userWhoUnFollowed.following = userWhoUnFollowed.following.filter(
      following => following.toString() !== userToBeUnfollowed._id.toJSON()
    );
    await userWhoUnFollowed.save();

    await session.commitTransaction();
    await session.endSession();
    return res.json({
      statusCode: 200,
      message: 'You have successfully unfollowed this user',
    });
  } catch (e: any) {
    await session.abortTransaction();
    await session.endSession();
    return next(appError(e.message));
  }
};
