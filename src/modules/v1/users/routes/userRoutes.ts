import express from 'express';
import {
  userProfileCtrl,
  whoViewMyProfileCtrl,
  followingCtrl,
  unfollowCtrl,
  blockUserCtrl,
  unblockUserCtrl,
  updatePasswordUserCtrl,
  checkExistsUserController,
  updateFirstNameCtrl,
  updateLastNameCtrl,
  updateAddressCtrl,
  updateJobCtrl,
  updateDescriptionCtrl,
  updateGenderCtrl,
  updateBirthdayCtrl,
  updateProfilePhotoCtrl
} from '../controllers/userController';
import {
  isAuthenticated,
  isValidationResult
} from '../../../../middlewares';
import {
  changePasswordValidation,
  firstNameValidation,
  lastNameValidation,
  addressValidation,
  jobValidation,
  descriptionValidation,
  genderValidation,
  birthdayValidation,
  profilePhotoValidation
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
userRouter.post(
  '/following/:id',
  isAuthenticated,
  followingCtrl
);

/**
 * @method Get::UnFollow
 */
userRouter.post(
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
  '/profile',
  isAuthenticated,
  userProfileCtrl
);

/**
 * @method PATCH::Updated first name
 */
userRouter.patch(
  '/firstname',
  firstNameValidation(),
  isValidationResult,
  isAuthenticated,
  updateFirstNameCtrl
);

/**
 * @method PATCH::Updated last name
 */
userRouter.patch(
  '/lastname',
  lastNameValidation(),
  isValidationResult,
  isAuthenticated,
  updateLastNameCtrl
);

/**
 * @method PATCH::Updated user address
 */
userRouter.patch(
  '/address',
  addressValidation(),
  isValidationResult,
  isAuthenticated,
  updateAddressCtrl
);

/**
 * @method PATCH::Updated user job
 */
userRouter.patch(
  '/job',
  jobValidation(),
  isValidationResult,
  isAuthenticated,
  updateJobCtrl
);

/**
 * @method PATCH::Updated user description
 */
userRouter.patch(
  '/description',
  descriptionValidation(),
  isValidationResult,
  isAuthenticated,
  updateDescriptionCtrl
);

/**
 * @method PATCH::Updated user gender
 */
userRouter.patch(
  '/gender',
  genderValidation(),
  isValidationResult,
  isAuthenticated,
  updateGenderCtrl
);

/**
 * @method PATCH::Updated user birthday
 */
userRouter.patch(
  '/birthday',
  birthdayValidation(),
  isValidationResult,
  isAuthenticated,
  updateBirthdayCtrl
);

/**
 * @method PATCH::Updated password user
 */
userRouter.patch(
  '/passwords',
  changePasswordValidation(),
  isValidationResult,
  isAuthenticated,
  updatePasswordUserCtrl
);

/**
 * @method PATCH::Updated profile photo
 */
userRouter.patch(
  '/profilephoto',
  profilePhotoValidation(),
  isValidationResult,
  isAuthenticated,
  updateProfilePhotoCtrl
);

/**
 * @method Get::Check exists email
 */
userRouter.get(
  '/check-exists/:email',
  isAuthenticated,
  checkExistsUserController,
);

export default userRouter;
