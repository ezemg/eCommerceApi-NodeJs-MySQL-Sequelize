const { Router } = require('express');

const {
  addressGet,
  addressPost,
  countryPost,
  countryGet,
  addressGetByUuid,
  countryGetByUuid,
} = require('../controllers/addressControler.js');

const router = Router();

router.get('/', addressGet);
router.get('/country', countryGet);
router.get('/:uuid', addressGetByUuid);
router.get('/country/:uuid', countryGetByUuid);

router.post('/', addressPost);
router.post('/country', countryPost);

module.exports = router;
