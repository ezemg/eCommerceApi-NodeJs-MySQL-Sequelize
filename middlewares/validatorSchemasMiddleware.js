const { checkSchema } = require('express-validator');

const userRegisterValidationSchema = checkSchema({
  email_address: {
    errorMessage: 'email is not valid',
    isEmail: true,
  },
  password: {
    isLength: {
      errorMessage: 'You must enter a password at least 6 characters long',
      options: { min: 6 },
    },
  },
});

module.exports = {
  userRegisterValidationSchema,
};
