const { validationResult } = require('express-validator');

const fieldsValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = [];

    errors.array().map((err) => {
      extractedErrors.push({ [err.path]: err.msg });
    });
    return res.status(400).json(extractedErrors);
  }
  next();
};

// const fieldsValidator = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json(errors);
//   }
//   next();
// };

module.exports = { fieldsValidator };
