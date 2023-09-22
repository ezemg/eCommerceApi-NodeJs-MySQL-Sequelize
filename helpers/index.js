const dbValidators = require('./dbValidators.js');

const JWTGenerator = require('./JWTGenerator.js');

module.exports = {
  ...dbValidators,
  ...JWTGenerator,
};
