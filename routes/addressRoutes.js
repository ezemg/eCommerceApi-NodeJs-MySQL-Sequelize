const { Router } = require('express');

const {
  addressGet,
  addressPost,
  countryPost,
  countryGet,
} = require('../controllers/addressControler.js');

const router = Router();

router.get('/', addressGet);
router.get('/country', countryGet);

router.post('/', addressPost);
router.post('/country', countryPost);

module.exports = router;
