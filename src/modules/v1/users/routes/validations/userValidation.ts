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
  isLoginGoogle: {
    optional: {
      options: {
        checkFalsy: true
      }
    },
    isBoolean: {
      errorMessage: 'The isLoginGoogle must be a boolean.',
    }
  },
  isAdmin: {
    optional: {
      options: {
        checkFalsy: true
      }
    },
    isBoolean: {
      errorMessage: 'The isAdmin must be a boolean.',
    }
  },
  role: {
    optional: {
      options: {
        checkFalsy: true
      }
    },
    matches: {
      options: [/\b(?:admin|creator|editor|normal)\b/],
      errorMessage: 'Invalid role type',
    },
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
  plan: {
    optional: {
      options: {
        checkFalsy: true
      }
    },
    matches: {
      options: [/\b(?:free|premium|pro)\b/],
      errorMessage: 'Invalid plan type',
    },
  },
  userAward: {
    optional: {
      options: {
        checkFalsy: true
      }
    },
    matches: {
      options: [/\b(?:bronze|silver|gold)\b/],
      errorMessage: 'Invalid userAward type',
    },
  }
});

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
 * Validation change email
 */
export const changeEmailValidation = () => checkSchema({
  email: {
    in: ['body'],
    isEmail: {
      errorMessage: 'PLease enter email valid',
    },
    notEmpty: {
      errorMessage: 'The email field is required',
    },
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
