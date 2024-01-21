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
      options: /^[a-zA-Z\-\s]+$/,
      errorMessage: 'Please enter only letter characters.'
    }
  },
  lastName: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The lastName field is required',
    },
    matches: {
      options: /^[a-zA-Z\-\s]+$/,
      errorMessage: 'Please enter only letter characters'
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
      errorMessage: 'The birthDay must be a string.',
    }
  },
  address: {
    optional: {
      options: {
        checkFalsy: true
      }
    },
    isString: {
      errorMessage: 'The address must be a string.',
    }
  },
  job: {
    optional: {
      options: {
        checkFalsy: true
      }
    },
    isString: {
      errorMessage: 'The job must be a string.',
    }
  },
  description: {
    optional: {
      options: {
        checkFalsy: true
      }
    },
    isString: {
      errorMessage: 'The job must be a string.',
    }
  },
});

/**
 * Validation first name
 */
export const profilePhotoValidation = () => checkSchema({
  profilePhoto: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The profilePhoto field is required',
    },
    isString: {
      errorMessage: 'The profilePhoto must be a string.',
    }
  }
});

/**
 * Validation change password
 */
export const changePasswordValidation = () => checkSchema({
  password: {
    in: ['body'],
    optional: {
      options: {
        checkFalsy: true
      }
    },
    matches: {
      options: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
      errorMessage: 'Password must contain at least one number, lower case, upper case and enter 8 or more characters'
    }
  },
  newPassword: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The newPassword field is required',
    },
    matches: {
      options: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
      errorMessage: 'newPassword must contain at least one number, lower case, upper case and enter 8 or more characters'
    }
  },
  newConfirmPassword: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The newConfirmPassword field is required',
    },
    matches: {
      options: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
      errorMessage: 'newConfirmPassword must contain at least one number, lower case, upper case and enter 8 or more characters'
    }
  },
});

/**
 * Validation first name
 */
export const firstNameValidation = () => checkSchema({
  firstName: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The firstName field is required',
    },
    matches: {
      options: /^[a-zA-Z\-\s]+$/,
      errorMessage: 'Please enter only letter characters.'
    },
    isLength: {
      options: { min: 3, max: 25 },
      errorMessage: 'The firstName must between 3 - 25 characters'
    }
  }
});

/**
 * Validation last name
 */
export const lastNameValidation = () => checkSchema({
  lastName: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The lastName field is required',
    },
    matches: {
      options: /^[a-zA-Z\-\s]+$/,
      errorMessage: 'Please enter only letter characters.'
    },
    isLength: {
      options: { min: 3, max: 25 },
      errorMessage: 'The lastName must between 3 - 25 characters'
    }
  }
});

/**
 * Validation address
 */
export const addressValidation = () => checkSchema({
  address: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The address must be a string.'
    },
    matches: {
      options: /^[a-zA-Z0-9,/\-\s]+$/,
      errorMessage: 'Please enter letter characters, number and "/" special character'
    },
    isLength: {
      options: { max: 255 },
      errorMessage: 'Address must not exceed 255 characters'
    }
  }
});

/**
 * Validation user job
 */
export const jobValidation = () => checkSchema({
  job: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The job must be a string.'
    },
    matches: {
      options: /^[a-zA-Z0-9@!?&.,/\-\s]+$/,
      errorMessage: 'Please enter letter characters, number and [@!?&.,-] special characters'
    },
    isLength: {
      options: { min: 25, max: 500 },
      errorMessage: 'Job must not exceed 255 characters'
    }
  }
});

/**
 * Validation user description
 */
export const descriptionValidation = () => checkSchema({
  description: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The description must be a string.'
    },
    matches: {
      options: /^[a-zA-Z0-9@!?&.,'"/\-\s]+$/,
      errorMessage: 'Please enter letter characters, number and [@!?&.,-\'\"] special characters'
    },
    isLength: {
      options: { min: 25, max: 500 },
      errorMessage: 'Description must between 25 - 500 characters'
    }
  }
});

/**
 * Validation user gender
 */
export const genderValidation = () => checkSchema({
  gender: {
    in: ['body'],
    matches: {
      options: [/\b(?:female|male|other)\b/],
      errorMessage: 'Invalid gender type',
    }
  }
});

/**
 * Validation user birthday
 */
export const birthdayValidation = () => checkSchema({
  birthDay: {
    in: ['body'],
    notEmpty: {
      errorMessage: 'The birthDay field is required',
    },
    isString: {
      errorMessage: 'The birthDay must be a string.',
    }
  }
});
