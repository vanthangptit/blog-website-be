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

  if (!isCreated) {
    schema['id'] = {
      in: ['params'],
      notEmpty: {
        errorMessage: 'The post is invalid',
      }
    };
  }

  schema['tags'] = {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The tags is required',
    },
    isArray: {
      options: { min: 1, max: 4 },
      errorMessage: 'Tags can not be empty',
    }
  };

  return checkSchema(schema);
};

export const paramsPostValidation = () => checkSchema({
  id: {
    in: ['params'],
    notEmpty: {
      errorMessage: 'The post id is required',
    },
    isString: {
      errorMessage: 'The post id must be a string.',
    }
  }
});

export const associateValidation = () => checkSchema({
  id: {
    in: ['params'],
    notEmpty: {
      errorMessage: 'The post id is required',
    },
    isString: {
      errorMessage: 'The post id must be a string.',
    }
  },
  associate: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The post id is required',
    },
    matches: {
      options: [/\b(?:likes|disLikes|hearts|stars)\b/],
      errorMessage: "Invalid role"
    }
  }
});
