const { Router } = require('express');
const {
  productsGet,
  variationsGet,
  variationOptionsGet,
  productItemsGet,
  variationsPost,
  variationsPut,
  variationsDelete,
  variationsGetByUuid,
  variationOptionsGetByUuid,
  variationOptionsPost,
  variationOptionsPut,
  variationOptionsDelete,
} = require('../controllers/productsController.js');
const { JWTValidator } = require('../middlewares/JWTValidator.js');

const router = Router();

router.get('/');

// List all
router.get('/', JWTValidator, productsGet);
router.get('/variations', JWTValidator, variationsGet);
router.get('/variation_options', JWTValidator, variationOptionsGet);
router.get('/product_item', JWTValidator, productItemsGet);

// Get by UUID
router.get('/:uuid ', JWTValidator);
router.get('/variations/:uuid', JWTValidator, variationsGetByUuid);
router.get('/variation_options/:uuid', JWTValidator, variationOptionsGetByUuid);
router.get('/product_item/:uuid', JWTValidator);

// Create new
router.post('/', JWTValidator);
router.post('/variations', JWTValidator, variationsPost);
router.post('/variation_options', JWTValidator, variationOptionsPost);
router.post('/product_item');

// Update db entry
router.put('/:uuid', JWTValidator);
router.put('/variations/:uuid', JWTValidator, variationsPut);
router.put('/variation_options/:uuid', JWTValidator, variationOptionsPut);
router.put('/product_item', JWTValidator);

// Soft delete entry
router.delete('/:uuid', JWTValidator);
router.delete('/variations/:uuid', JWTValidator, variationsDelete);
router.delete('/variation_options/:uuid', JWTValidator, variationOptionsDelete);
router.delete('/product_item/:uuid', JWTValidator);

module.exports = router;
