import { NextFunction, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import moment from 'moment';
import { startSession } from 'mongoose';

import {
  passwordHash,
  comparePassword,
  generateToken,
  appError
} from '../../../../utils';
import { User } from '../models/User';
import { Category } from '../../categories/models/Category';
import { EmailVerification } from '../../emails/models/EmailVerification';
import { Post } from '../../posts/models/Post';
import { Comment} from '../../comments/models/Comment';
import {IUser} from "../../../../domain/interfaces";

/**
 * Register user
 */
export const userRegisterCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, profilePhoto, email, password, passwordConfirm } = req.body;
  const session = await startSession();
  session.startTransaction();

  try {
    const userFound = await User.findOne({ email });
    if (userFound)
      return next(appError('Email already exists', 404));

    if (passwordConfirm !== password)
      return next(appError('Password not match', 400));

    const user = await User.create([{
      firstName,
      lastName,
      profilePhoto,
      email,
      password: await passwordHash(password)
    }], { session  });

    const token = nanoid();
    await EmailVerification.create([{
      token,
      user: user[0]?._id,
      validUntil: moment(new Date()).add(1, 'day')
    }], { session });

    /** @todo google cloud (Oauth2 - blog-website)
     * https://console.cloud.google.com/apis/credentials?project=blog-website-404616&supportedpurview=project
     **/
    // await sendVerifyEmailMail(email, `${firstName + ' ' + lastName}`, token);

    await session.commitTransaction();
    await session.endSession();

    return res.json({
      status: 200,
      message: 'User created successful',
      data: user[0],
    });
  } catch (e: any) {
    await session.abortTransaction();
    await session.endSession();
    return next(appError(e.message));
  }
};

/**
 * Login user
 */
export const userLoginCtrl = async (
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

/**
 * Get users
 */
export const userGetAllCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({});
    return res.json({
      status: 200,
      message: 'Get all user successfully',
      data: users,
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};

/**
 * Get profile
 */
export const userProfileCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const user: IUser | null = await User.findById(id)
      .select({ password: 0 })
      .populate({
      path: 'posts',
    });
    if (!user)
      return next(appError('User not found', 404));

    return res.status(200).json({
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
    const isUserAlreadyViewed = user.viewers.find(viewer => viewer.toString() === userWhoViewed._id.toJSON());
    if (isUserAlreadyViewed) {
      return next(appError('You already viewed this profile', 401));
    }

    //5. Push the user userWhoViewed to the user's viewers array
    user.viewers.push(userWhoViewed._id);
    //6. Save the user
    await user.save();

    return res.status(200).json({
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
  try {
    // 1. Find the user to follow
    const userToFollow = await User.findById(req.params.id);

    // 2. Find the user who is follow
    const userWhoFollowed = await User.findById(req.body.userAuth.id);

    if (!userToFollow || !userWhoFollowed) {
      return next(appError('The user or profile can not found', 404));
    }

    //3. Check if userWhoFollowed is already in the users followers array
    const isUserAlreadyFollowed = userToFollow.following.find(follower => follower.toString() === userWhoFollowed._id.toJSON());
    if (isUserAlreadyFollowed) {
      return next(appError('You already followed this user', 401));
    }

    //4. Push userWhoFollowed to the user's followers array
    userToFollow.followers.push(userWhoFollowed._id);
    //5. Push userToFollow to the userWhoFollowed's following array
    userWhoFollowed.following.push(userToFollow._id);

    //6. Save the user
    await userToFollow.save();
    await userWhoFollowed.save();

    return res.status(200).json({
      message: 'You have successfully followed this user',
    });
  } catch (e: any) {
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
  try {
    // 1. Find the user to unfollow
    const userToBeUnfollowed = await User.findById(req.params.id);

    // 2. Find the user who is unfollowing
    const userWhoUnFollowed = await User.findById(req.body.userAuth.id);

    if (!userToBeUnfollowed || !userWhoUnFollowed) {
      return next(appError('The follower or following can not found', 404));
    }

    //4. Check if userWhoUnFollowed is already in the users followers array
    const isUserAlreadyFollowed = userToBeUnfollowed.followers.find(follower => follower.toString() === userWhoUnFollowed._id.toJSON());
    if (!isUserAlreadyFollowed) {
      return next(appError('You have not followed this user', 401));
    }

    //5. Remove userWhoUnFollowed to the user's followers array
    userToBeUnfollowed.followers = userToBeUnfollowed.followers.filter(follower => follower.toString() !== userWhoUnFollowed._id.toJSON());
    await userToBeUnfollowed.save();
    //6. Remove userToBeUnfollowed from userWhoUnFollowed's following array
    userWhoUnFollowed.following = userWhoUnFollowed.following.filter(following => following.toString() !== userToBeUnfollowed._id.toJSON());
    await userWhoUnFollowed.save();

    return res.status(200).json({
      message: 'You have successfully unfollowed this user',
    });
  } catch (e: any) {
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
    const isUserAlreadyBlocked = userWhoBlocked.blocked.find(blocker => blocker.toString() === userToBeBlocked._id.toJSON());
    if (isUserAlreadyBlocked) {
      return next(appError('You already blocked this profile', 401));
    }

    //5. Push the user userToBeBlocked to the user's blocked array
    userWhoBlocked.blocked.push(userWhoBlocked._id);
    //6. Save the user
    await userWhoBlocked.save();

    return res.status(200).json({
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
    const isUserAlreadyBlocked = userWhoUnBlocked.blocked.find(blocker => blocker.toString() === userToBeUnBlocked._id.toJSON());
    if (isUserAlreadyBlocked) {
      return next(appError('You already unblocked this user', 401));
    }

    //5. Push the user userToBeBlocked to the user's blocked array
    userWhoUnBlocked.blocked = userWhoUnBlocked.blocked.filter(blocker => blocker.toString() !== userToBeUnBlocked._id.toJSON());
    //6. Save the user
    await userWhoUnBlocked.save();

    return res.status(200).json({
      message: 'You have successfully unblocked this user',
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
 * Update user
 */
export const userUpdateCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { firstName, lastName, profilePhoto, gender, birthDay } = req.body;
  try {
    const user = await User.findById(req.body.userAuth.id);

    if (!user)
      return next(appError('User is not exists', 401));

    const userUpdated = await User.findByIdAndUpdate(
      user._id,
      {
        firstName,
        lastName,
        profilePhoto,
        gender,
        birthDay,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json({
      status: 200,
      data: userUpdated,
      message: 'User updated successful'
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
  const { password, passwordConfirm } = req.body;

  if (!password || !passwordConfirm)
    return next(appError('Please provide password or passwordConfirm fields', 401));

  if (password !== passwordConfirm)
    return next(appError('Password and confirm password does not match', 401));

  try {
    const user = await User.findById(req.body.userAuth.id);
    if (!user)
      return next(appError('User is not exists', 401));

    await User.findByIdAndUpdate(
      user._id,
      {
        password: await passwordHash(password),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json({
      status: 200,
      message: 'The password updated successful'
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
      status: 200,
      message: 'User deleted successfully',
    });
  } catch (e: any) {
    return next(appError(e.message));
  }
};
