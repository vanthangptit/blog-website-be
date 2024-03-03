import { checkSchema } from 'express-validator';

/**
 * Validation create the post based on header
 */
export const commentValidation = () => checkSchema({
  description: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The description field is required',
    },
    isString: {
      errorMessage: 'The description must be a string.',
    }
  },
});
