import { checkSchema } from 'express-validator';

/**
 * Validation login based on header
 */
export const logoutValidation = () => checkSchema({
  refreshToken: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The refreshToken is required',
    },
    isString: {
      errorMessage: 'The refreshToken must be a string.',
    }
  },
  userId: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The userId is required',
    },
    isString: {
      errorMessage: 'The userId must be a string.',
    }
  }
});
