const { Router } = require('express');
const {
  paymentMethodsGet,
  paymentMethodsGetByUuid,
  paymentMethodsPost,
  paymentMethodsPut,
  paymentMethodsDelete,
} = require('../controllers/paymentMethodsController.js');
const { JWTValidator } = require('../middlewares/JWTValidator.js');

const router = Router();

// shopOrder
router.get('/', JWTValidator, paymentMethodsGet);
router.get('/:uuid', JWTValidator, paymentMethodsGetByUuid);
router.post('/', JWTValidator, paymentMethodsPost);
router.put('/:uuid', JWTValidator, paymentMethodsPut);
router.delete('/:uuid', JWTValidator, paymentMethodsDelete);

module.exports = router;
