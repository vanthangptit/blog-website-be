import { checkSchema } from 'express-validator';

/**
 * Validation create the post based on header
 */
export const categoryValidation = () => checkSchema({
  title: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The title field is required',
    },
    isString: {
      errorMessage: 'The title must be a string.',
    }
  },
  image: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The image is required',
    },
    isString: {
      errorMessage: 'The image must be a string.',
    }
  },
});
