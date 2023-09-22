const { Router } = require('express');
const {
  categoriesGet,
  categoriesPost,
  categoriesDelete,
  categoriesGetByUuid,
  categoriesPut,
} = require('../controllers/categoriesController.js');
const { JWTValidator } = require('../middlewares/JWTValidator.js');

const router = Router();

router.get('/', JWTValidator, categoriesGet);
router.get('/:uuid', JWTValidator, categoriesGetByUuid);
router.post('/', JWTValidator, categoriesPost);
router.delete('/:uuid', JWTValidator, categoriesDelete);
router.put('/:uuid', JWTValidator, categoriesPut);

module.exports = router;
