import express from 'express';
import {
  userProfileCtrl,
  userUpdateCtrl,
  whoViewMyProfileCtrl,
  followingCtrl,
  unfollowCtrl,
  blockUserCtrl,
  unblockUserCtrl,
  updatePasswordUserCtrl,
  checkExistsUserController,
} from '../controllers/userController';
import {
  isAuthenticated,
  isValidationResult
} from '../../../../middlewares';
import {
  changePasswordValidation,
  updateUserValidation
} from './validations/userValidation';

const userRouter = express.Router();

/**
 * @method Get::Profile viewers
 */
userRouter.get(
  '/profile-viewers/:id',
  isAuthenticated,
  whoViewMyProfileCtrl
);

/**
 * @method Get::Following
 */
userRouter.get(
  '/following/:id',
  isAuthenticated,
  followingCtrl
);

/**
 * @method Get::UnFollow
 */
userRouter.get(
  '/unfollower/:id',
  isAuthenticated,
  unfollowCtrl
);

/**
 * @method Get::Block user
 */
userRouter.get(
  '/block/:id',
  isAuthenticated,
  blockUserCtrl
);

/**
 * @method Get::unblock user
 */
userRouter.get(
  '/unblock/:id',
  isAuthenticated,
  unblockUserCtrl
);

/**
 * @method Get::Get profile user
 */
userRouter.get(
  '/profile/:id',
  isAuthenticated,
  userProfileCtrl
);

/**
 * @method PUT::Updated user
 */
userRouter.put(
  '/',
  updateUserValidation(),
  isValidationResult,
  isAuthenticated,
  userUpdateCtrl
);

/**
 * @method PUT::Updated password user
 */
userRouter.put(
  'update-password',
  changePasswordValidation(),
  isValidationResult,
  isAuthenticated,
  updatePasswordUserCtrl
);

/**
 * @method Get::Check exists email
 */
userRouter.get(
  'check-exists/:email',
  isAuthenticated,
  checkExistsUserController,
);

export default userRouter;
