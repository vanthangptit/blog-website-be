import { checkSchema } from 'express-validator';

/**
 * Validation login based on header
 */
export const loginValidation = () => checkSchema({
  email: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The email is required',
    },
  },
  password: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The password is required',
    },
  }
});

/**
 * Validation login with google
 */
export const loginGoogleValidation = () => checkSchema({
  email: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The email is required',
    },
  },
  password: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The password is required',
    },
  }
});
