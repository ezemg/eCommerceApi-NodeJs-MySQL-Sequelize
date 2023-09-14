const { Router } = require('express');
const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
  usuariosGetByUuid,
} = require('../controllers/usuariosController.js');

const router = Router();

router.get('/', usuariosGet);

router.get('/:uuid', usuariosGetByUuid);

router.put('/:uuid', usuariosPut);

router.post('/', usuariosPost);

router.patch('/:uuid', usuariosPatch);

router.delete('/:uuid', usuariosDelete);

module.exports = router;
