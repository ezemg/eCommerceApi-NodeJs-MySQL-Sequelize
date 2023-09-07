const { response } = require('express');
const db = require('../database/models');

const usuariosGet = (req, res = response) => {
  const { user = 'Undefined User', nombre = 'Undefined Name' } = req.query;
  res.json({
    msg: 'get API - controlador',
    user,
    nombre,
  });
};

const usuariosPut = (req, res = response) => {
  const id = req.params.id;

  res.status(500).json({
    msg: 'put API - controlador',
    id,
  });
};
const usuariosPost = (req, res = response) => {
  const { nombre, edad } = req.body;
  res.status(201).json({
    msg: 'post API - controlador',
    nombre,
    edad,
  });
};
const usuariosPatch = (req, res = response) => {
  res.status(201).json({
    msg: 'post PATCH - controlador',
  });
};
const usuariosDelete = (req, res = response) => {
  res.json({
    msg: 'delete API - controlador',
  });
};



module.exports = {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuariosPatch,
  usuariosDelete,
  
};
