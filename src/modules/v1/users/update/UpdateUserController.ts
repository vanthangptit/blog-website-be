import { NextFunction, Request, Response } from 'express';

import {
  passwordHash,
  appError,
  comparePassword
} from '../../../../utils';
import moment from 'moment';
import { User } from '../userModel';
import { getUserById, isCheckUserExists } from '../userServices';

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
 * Update user bio
 */
export const updateBioCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { bio } = req.body;
  const userId = req.body.userAuth.id;
  try {
    await User.findByIdAndUpdate(
      userId,
      { bio },
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
 * Update user websiteUrl
 */
export const updateWebsiteUrlCtrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { websiteUrl } = req.body;
  const userId = req.body.userAuth.id;
  try {
    await User.findByIdAndUpdate(
      userId,
      { websiteUrl },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json({
      statusCode: 200,
      message: 'User websiteUrl updated successfully'
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
