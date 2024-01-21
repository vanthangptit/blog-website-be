import { checkSchema } from 'express-validator';

/**
 * Validation register user based on header
 */
export const registerValidation = () => checkSchema({
  firstName: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The firstName field is required',
    },
    isLength: {
      options: { min: 3, max: 25 },
      errorMessage: 'The firstName must between 3 - 25 characters'
    },
    matches: {
      options: /^[a-zA-Z\-\s]+$/,
      errorMessage: 'Please enter only letter characters.'
    }
  },
  lastName: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The lastName field is required',
    },
    isLength: {
      options: { min: 3, max: 25 },
      errorMessage: 'The lastName must between 3 - 25 characters'
    },
    matches: {
      options: /^[a-zA-Z\-\s]+$/,
      errorMessage: 'Please enter only letter characters'
    }
  },
  email: {
    in: ['body'],
    isEmail: {
      errorMessage: 'PLease enter email valid',
    },
    notEmpty: {
      errorMessage: 'The email field is required',
    },
  },
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
      errorMessage: 'The confirmPassword field is required',
    },
    matches: {
      options: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
      errorMessage: 'confirmPassword must contain at least one number, lower case, upper case and enter 8 or more characters'
    }
  },
});
