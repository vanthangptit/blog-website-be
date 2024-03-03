import express from 'express';
import {
  updatePasswordUserCtrl,
  updateFirstNameCtrl,
  updateLastNameCtrl,
  updateAddressCtrl,
  updateJobCtrl,
  updateBioCtrl,
  updateGenderCtrl,
  updateBirthdayCtrl,
  updateProfilePhotoCtrl,
  schoolCtrl,
  aliasCtrl,
  updateWebsiteUrlCtrl
} from './UpdateUserController';
import {
  changePasswordValidation,
  firstNameValidation,
  lastNameValidation,
  addressValidation,
  jobValidation,
  bioValidation,
  genderValidation,
  birthdayValidation,
  profilePhotoValidation,
  schoolValidation,
  aliasValidation,
  websiteUrlValidation
} from './validations/updateUserValidation';
import {
  isAuthenticated,
  isValidationResult
} from '../../../../middlewares';

const updateUserRouter = express.Router();

/**
 * @method PATCH::Updated first name
 */
updateUserRouter.patch(
  '/firstname',
  firstNameValidation(),
  isValidationResult,
  isAuthenticated,
  updateFirstNameCtrl
);

/**
 * @method PATCH::Updated last name
 */
updateUserRouter.patch(
  '/lastname',
  lastNameValidation(),
  isValidationResult,
  isAuthenticated,
  updateLastNameCtrl
);

/**
 * @method PATCH::Updated user address
 */
updateUserRouter.patch(
  '/address',
  addressValidation(),
  isValidationResult,
  isAuthenticated,
  updateAddressCtrl
);

/**
 * @method PATCH::Updated user job
 */
updateUserRouter.patch(
  '/job',
  jobValidation(),
  isValidationResult,
  isAuthenticated,
  updateJobCtrl
);

/**
 * @method PATCH::Updated user school
 */
updateUserRouter.patch(
  '/school',
  schoolValidation(),
  isValidationResult,
  isAuthenticated,
  schoolCtrl
);

/**
 * @method PATCH::Updated user alias
 */
updateUserRouter.patch(
  '/alias',
  aliasValidation(),
  isValidationResult,
  isAuthenticated,
  aliasCtrl
);

/**
 * @method PATCH::Updated user bio
 */
updateUserRouter.patch(
  '/bio',
  bioValidation(),
  isValidationResult,
  isAuthenticated,
  updateBioCtrl
);

/**
 * @method PATCH::Updated user websiteUrl
 */
updateUserRouter.patch(
  '/websiteUrl',
  websiteUrlValidation(),
  isValidationResult,
  isAuthenticated,
  updateWebsiteUrlCtrl
);

/**
 * @method PATCH::Updated user gender
 */
updateUserRouter.patch(
  '/gender',
  genderValidation(),
  isValidationResult,
  isAuthenticated,
  updateGenderCtrl
);

/**
 * @method PATCH::Updated user birthday
 */
updateUserRouter.patch(
  '/birthday',
  birthdayValidation(),
  isValidationResult,
  isAuthenticated,
  updateBirthdayCtrl
);

/**
 * @method PATCH::Updated password user
 */
updateUserRouter.patch(
  '/passwords',
  changePasswordValidation(),
  isValidationResult,
  isAuthenticated,
  updatePasswordUserCtrl
);

/**
 * @method PATCH::Updated profile photo
 */
updateUserRouter.patch(
  '/profilephoto',
  profilePhotoValidation(),
  isValidationResult,
  isAuthenticated,
  updateProfilePhotoCtrl
);

export default updateUserRouter;
