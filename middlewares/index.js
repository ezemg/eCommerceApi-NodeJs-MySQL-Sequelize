const fieldsValidator = require('../middlewares/fieldsValidator.js');
const JWTValidator = require('../middlewares/JWTValidator.js');
const roleValidator = require('../middlewares/roleValidator.js');
const validatorSchemasMiddleware = require('../middlewares/validatorSchemasMiddleware.js');

module.exports = {
  ...fieldsValidator,
  ...JWTValidator,
  ...roleValidator,
  ...validatorSchemasMiddleware,
};
