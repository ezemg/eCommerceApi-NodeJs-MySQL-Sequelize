const { Router } = require('express');
const { check } = require('express-validator');

// Middlewares
const {
  fieldsValidator,
  hasRole,
  isAdminRole,
  JWTValidator,
} = require('../middlewares');

// Helpers
const {
  categoryExistsByUuid,
  emailExists,
  isValidRole,
  JWTGenerator,
  productExistsByUuid,
  userExistsByUuid,
} = require('../helpers');
// Controlador
const {
  usersDelete,
  usersGet,
  usersGetByUuid,
  usersPatch,
  usersPost,
  usersPut,
} = require('../controllers/usersController.js');
const {
  schemaUserValidation,
  userRegisterValidationSchema,
} = require('../middlewares/validatorSchemasMiddleware.js');

const router = Router();

router.get('/', usersGet);

router.get('/:uuid', usersGetByUuid);

router.put('/:uuid', usersPut);

router.post('/', userRegisterValidationSchema, fieldsValidator, usersPost);

router.patch('/:uuid', usersPatch);

router.delete('/:uuid', usersDelete);

module.exports = router;
