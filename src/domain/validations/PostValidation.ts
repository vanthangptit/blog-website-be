import { checkSchema } from 'express-validator';

/**
 * Validation create the post based on header
 */
export const createPostValidation = () => checkSchema({
  title: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The title field is required',
    },
    isLength: {
      options: { min: 5, max: 50 },
      errorMessage: 'Title required and must between 5 - 50 characters'
    }
  },
  excerpt: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The excerpt field is required',
    },
    isLength: {
      options: { min: 25, max: 255 },
      errorMessage: 'Excerpt required and must between 25 - 255 characters'
    }
  },
  description: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The description field is required',
    },
  },
  imageUrl: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The description field is required',
    },
    isString: {
      errorMessage: 'The imageUrl must be a string.',
    }
  },
  shortUrl: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The description field is required',
    },
    isString: {
      errorMessage: 'The shortUrl must be a string.',
    }
  },
  postType: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The description field is required',
    },
    matches: {
      options: [/\b(?:society|sports|technology|traveling|history|learn|lovely|poem|review|life|diary)\b/],
      errorMessage: 'Invalid postType type',
    },
  },
  writer: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The writer field is required',
    },
    isString: {
      errorMessage: 'The writer must be a string.',
    }
  },
  isPublished: {
    in: ['body'],
    isBoolean: {
      errorMessage: 'The writer must be a boolean.',
    },
  }
});
