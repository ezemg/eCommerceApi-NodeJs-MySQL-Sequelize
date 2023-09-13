const { Router } = require('express');
const {
  rolesGet,
  rolesPut,
  rolesPost,
  rolesDelete,
} = require('../controllers/rolesController.js');

const router = Router();

router.get('/', rolesGet);
router.put('/:uuid', rolesPut);
router.post('/', rolesPost);
router.delete('/:uuid', rolesDelete);

module.exports = router;
