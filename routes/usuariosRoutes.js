const { Router } = require('express');
const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
} = require('../controllers/usuariosController.js');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id', usuariosPut);

router.post('/', usuariosPost);

router.patch('/', usuariosPatch);

router.delete('/', usuariosDelete);

module.exports = router;
