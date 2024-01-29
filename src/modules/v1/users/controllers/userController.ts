import { NextFunction, Request, Response } from 'express';

import {
  passwordHash,
  appError,
  comparePassword
} from '../../../../utils';
import { User } from '../models/User';
import { IUserModel } from '../../../../domain/interfaces';
import moment from 'moment';
import { getUserById, isCheckUserExists } from '../services/userServices';
import { startSession } from 'mongoose';

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
    // 1. Find the original
    const user = await User.findById(req.params.id);

    // 2. Find the user who viewed the original user
    const userWhoViewed = await User.findById(req.body.userAuth.id);

    // 3. Check if original or who viewed are not found
    if (!user || !userWhoViewed) {
      return next(appError('The user or profile can not found', 404));
    }

    //4. Check if userWhoViewed is already in the users viewers array
    const isUserAlreadyViewed = user.viewers.find(
      viewer => viewer.toString() === userWhoViewed._id.toJSON()
    );
    if (isUserAlreadyViewed) {
      return next(appError('You already viewed this profile', 400));
    }

    //5. Push the user userWhoViewed to the user's viewers array
    user.viewers.push(userWhoViewed._id);
    //6. Save the user
    await user.save();

    return res.json({
      statusCode: 200,
      message: 'You have successfully viewed this profile',
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

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

/**
 * Block user
 */
export const blockUserCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Find the user to be blocked
    const userToBeBlocked = await User.findById(req.params.id);

    // 2. Find the user who is blocking
    const userWhoBlocked = await User.findById(req.body.userAuth.id);

    // 3. Check if original or who viewed are not found
    if (!userToBeBlocked || !userWhoBlocked) {
      return next(appError('blockUser::The user can not found', 404));
    }

    //4. Check if userWhoVBlocked is already in the users blocked array
    const isUserAlreadyBlocked = userWhoBlocked.blocked.find(
      blocker => blocker.toString() === userToBeBlocked._id.toJSON()
    );
    if (isUserAlreadyBlocked) {
      return next(appError('You already blocked this profile', 400));
    }

    //5. Push the user userToBeBlocked to the user's blocked array
    userWhoBlocked.blocked.push(userWhoBlocked._id);
    //6. Save the user
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
    // 1. Find the user to be blocked
    const userToBeUnBlocked = await User.findById(req.params.id);

    // 2. Find the user who is blocking
    const userWhoUnBlocked = await User.findById(req.body.userAuth.id);

    // 3. Check if original or who viewed are not found
    if (!userToBeUnBlocked || !userWhoUnBlocked) {
      return next(appError('Unblock::The user can not found', 404));
    }

    //4. Check if userWhoUnblocked is already in the array's of userWhoUnBlocked
    const isUserAlreadyBlocked = userWhoUnBlocked.blocked.find(
      blocker => blocker.toString() === userToBeUnBlocked._id.toJSON()
    );
    if (isUserAlreadyBlocked) {
      return next(appError('You already unblocked this user', 400));
    }

    //5. Push the user userToBeBlocked to the user's blocked array
    userWhoUnBlocked.blocked = userWhoUnBlocked.blocked.filter(
      blocker => blocker.toString() !== userToBeUnBlocked._id.toJSON()
    );
    //6. Save the user
    await userWhoUnBlocked.save();

    return res.json({
      statusCode: 200,
      message: 'You have successfully unblocked this user',
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Update profile photo
 */
export const updateProfilePhotoCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { profilePhoto } = req.body;
  const userId = req.body.userAuth.id;

  try {
    await User.findByIdAndUpdate(
      userId,
      {
        profilePhoto
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json({
      statusCode: 200,
      message: 'The photo updated successfully'
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Update password user
 */
export const updatePasswordUserCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { password, newPassword, newConfirmPassword } = req.body;
  const userId = req.body.userAuth.id;

  if (newPassword !== newConfirmPassword)
    return next(appError('Your new passwords do no match', 400));

  try {
    const user = await getUserById(req.body.userAuth.id);
    if (!user)
      return next(appError('User is not exists', 404));

    if (user.isLoginGoogle) {
      if (user?.password) {
        if (!password)
          return next(appError('The password field is required', 400));
        const isPasswordMatched = await comparePassword(password, user.password);
        if (!isPasswordMatched)
          return next(appError('The password is invalid.', 400));
      }
    } else {
      if (!password)
        return next(appError('The password field is required', 400));
      const isPasswordMatched = await comparePassword(password, user.password ?? '');
      if (!isPasswordMatched)
        return next(appError('The password is invalid.', 400));
    }

    await User.findByIdAndUpdate(
      userId,
      {
        password: await passwordHash(newPassword),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json({
      statusCode: 200,
      message: 'The password updated successful'
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Update first name
 */
export const updateFirstNameCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName } = req.body;
  const userId = req.body.userAuth.id;
  try {
    await User.findByIdAndUpdate(
      userId,
      { firstName },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json({
      statusCode: 200,
      message: 'First name updated successfully'
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Update last name
 */
export const updateLastNameCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { lastName } = req.body;
  const userId = req.body.userAuth.id;
  try {
    await User.findByIdAndUpdate(
      userId,
      { lastName },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json({
      statusCode: 200,
      message: 'Last mame updated successfully'
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Update user address
 */
export const updateAddressCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { address } = req.body;
  const userId = req.body.userAuth.id;
  try {
    await User.findByIdAndUpdate(
      userId,
      { address },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json({
      statusCode: 200,
      message: 'User address updated successfully'
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Update user job
 */
export const updateJobCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { job } = req.body;
  const userId = req.body.userAuth.id;
  try {
    await User.findByIdAndUpdate(
      userId,
      { job },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json({
      statusCode: 200,
      message: 'User job updated successfully'
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Update user school
 */
export const schoolCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { school } = req.body;
  const userId = req.body.userAuth.id;
  try {
    await User.findByIdAndUpdate(
      userId,
      { school },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json({
      statusCode: 200,
      message: 'User school updated successfully'
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Update user alias
 */
export const aliasCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { alias } = req.body;
  const userId = req.body.userAuth.id;
  try {
    const aliasExists = await isCheckUserExists(alias);
    if (aliasExists)
      return next(appError('Alias is exists', 400));

    await User.findByIdAndUpdate(
      userId,
      { alias },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json({
      statusCode: 200,
      message: 'Alias updated successfully'
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Update user description
 */
export const updateDescriptionCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { description } = req.body;
  const userId = req.body.userAuth.id;
  try {
    await User.findByIdAndUpdate(
      userId,
      { description },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json({
      statusCode: 200,
      message: 'User description updated successfully'
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Update user gender
 */
export const updateGenderCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { gender } = req.body;
  const userId = req.body.userAuth.id;
  try {
    await User.findByIdAndUpdate(
      userId,
      { gender },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json({
      statusCode: 200,
      message: 'User gender updated successfully'
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Update user birthday
 */
export const updateBirthdayCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { birthDay } = req.body;
  const userId = req.body.userAuth.id;
  try {
    if (
      birthDay &&
      birthDay.length &&
      moment(birthDay).isAfter(moment(new Date()))
    ) {
      return next(appError('Birthday can not before date now!', 400));
    }

    await User.findByIdAndUpdate(
      userId,
      { birthDay },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json({
      statusCode: 200,
      message: 'User birthday updated successfully'
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};


/**
 * Check exists user
 */
export const checkExistsUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isUsernameAvailable = await User.findOne({ email: req.params.email });

    return res.json({
      statusCode: 200,
      data: { isUsernameAvailable: !!isUsernameAvailable },
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};
