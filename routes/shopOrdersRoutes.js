const { Router } = require('express');
const { JWTValidator } = require('../middlewares/JWTValidator.js');
const {
  shopOrdersGet,
  shopOrdersGetByUuid,
  shopOrdersPost,
  shopOrdersPut,
  shopOrdersDelete,
  orderStatusGet,
  orderStatusGetByUuid,
  orderStatusPost,
  orderStatusPut,
  orderStatusDelete,
  orderLineGet,
  orderLineGetByUuid,
  orderLinePost,
  orderLinePut,
  orderLineDelete,
  userReviewGet,
  userReviewGetByUuid,
  userReviewPost,
  userReviewPut,
  userReviewDelete,
  shippingMethodsGet,
  shippingMethodsGetByUuid,
  shippingMethodsPost,
  shippingMethodsPut,
  shippingMethodsDelete,
} = require('../controllers/shopOrdersController.js');

const router = Router();

// shopOrder
router.get('/', JWTValidator, shopOrdersGet);
router.get('/order_status', JWTValidator, orderStatusGet);
router.get('/order_line', JWTValidator, orderLineGet);
router.get('/user_review', JWTValidator, userReviewGet);
router.get('/shipping_method', JWTValidator, shippingMethodsGet);

router.get('/:uuid', JWTValidator, shopOrdersGetByUuid);
router.get('/order_status/:uuid', JWTValidator, orderStatusGetByUuid);
router.get('/order_line/:uuid', JWTValidator, orderLineGetByUuid);
router.get('/user_review/:uuid', JWTValidator, userReviewGetByUuid);
router.get('/shipping_method/:uuid', JWTValidator, shippingMethodsGetByUuid);

router.post('/', JWTValidator, shopOrdersPost);
router.post('/order_status', JWTValidator, orderStatusPost);
router.post('/order_line', JWTValidator, orderLinePost);
router.post('/user_review', JWTValidator, userReviewPost);
router.post('/shipping_method', JWTValidator, shippingMethodsPost);

router.put('/:uuid', JWTValidator, shopOrdersPut);
router.put('/order_status/:uuid', JWTValidator, orderStatusPut);
router.put('/order_line/:uuid', JWTValidator, orderLinePut);
router.put('/user_review/:uuid', JWTValidator, userReviewPut);
router.put('/shipping_method/:uuid', JWTValidator, shippingMethodsPut);

router.delete('/:uuid', JWTValidator, shopOrdersDelete);
router.delete('/order_status/:uuid', JWTValidator, orderStatusDelete);
router.delete('/order_line/:uuid', JWTValidator, orderLineDelete);
router.delete('/user_review/:uuid', JWTValidator, userReviewDelete);
router.delete('/shipping_method/:uuid', JWTValidator, shippingMethodsDelete);

module.exports = router;
