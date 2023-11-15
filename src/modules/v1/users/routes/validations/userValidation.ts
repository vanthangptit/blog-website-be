import { checkSchema } from 'express-validator';

/**
 * Validation update user based on the body
 */
export const updateUserValidation = () => checkSchema({
  firstName: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The firstName field is required',
    },
    matches: {
      options: /^[a-zA-Z!?&.\-\s]+$/,
      errorMessage: 'Please enter only letter characters.'
    }
  },
  lastName: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The lastName field is required',
    },
    matches: {
      options: /^[a-zA-Z!?&.\-\s]+$/,
      errorMessage: 'Please enter only letter characters'
    }
  },
  profilePhoto: {
    optional: {
      options: {
        checkFalsy: true
      }
    },
    isString: {
      errorMessage: 'The profilePhoto must be a string.',
    }
  },
  gender: {
    optional: {
      options: {
        checkFalsy: true
      }
    },
    matches: {
      options: [/\b(?:female|male|other)\b/],
      errorMessage: 'Invalid gender type',
    },
  },
  birthDay: {
    optional: {
      options: {
        checkFalsy: true
      }
    },
    isString: {
      errorMessage: 'The profilePhoto must be a string.',
    }
  },
});

/**
 * Validation change password
 */
export const changePasswordValidation = () => checkSchema({
  password: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The password field is required',
    },
    matches: {
      options: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
      errorMessage: 'Password must contain at least one number, lower case, upper case and enter 8 or more characters'
    }
  },
  passwordConfirm: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The password field is required',
    },
    matches: {
      options: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
      errorMessage: 'Password must contain at least one number, lower case, upper case and enter 8 or more characters'
    }
  },
});
