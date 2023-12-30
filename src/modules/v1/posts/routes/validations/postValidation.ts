import { checkSchema, Schema } from 'express-validator';

export const postValidation = (isCreated: boolean) => {
  const schema: Schema = {
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
  };

  if (isCreated) {
    schema['categoryId'] = {
      in: ['body'],
      notEmpty: {
        errorMessage: 'The categoryId is required',
      },
      isString: {
        errorMessage: 'The categoryId must be a string.',
      }
    }
  } else {
    schema['idOrShortUrl'] = {
      in: ['params'],
      notEmpty: {
        errorMessage: 'The idOrShortUrl is required',
      },
      isString: {
        errorMessage: 'The idOrShortUrl must be a string.',
      }
    }
  }

  return checkSchema(schema);
};

export const paramsPostValidation = () => checkSchema({
  idOrShortUrl: {
    in: ['params'],
    notEmpty: {
      errorMessage: 'The idOrShortUrl is required',
    },
    isString: {
      errorMessage: 'The idOrShortUrl must be a string.',
    }
  }
});
