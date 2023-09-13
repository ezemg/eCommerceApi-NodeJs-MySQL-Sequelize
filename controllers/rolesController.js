const { response } = require('express');
const db = require('../database/models');

const rolesGet = (req, res = response) => {
  try {
    res.status(200).json({
      msg: 'rolesGet',
    });
  } catch (error) {
    console.log(error);
  }
};
const rolesGetByUuid = (req, res = response) => {
  try {
    res.status(200).json({
      msg: 'rolesGetByUuid',
    });
  } catch (error) {
    console.log(error);
  }
};
const rolesPost = (req, res = response) => {
  try {
    res.status(200).json({
      msg: 'rolesPost',
    });
  } catch (error) {
    console.log(error);
  }
};
const rolesPut = (req, res = response) => {
  try {
    res.status(200).json({
      msg: 'rolesPut',
    });
  } catch (error) {
    console.log(error);
  }
};
const rolesDelete = (req, res = response) => {
  try {
    res.status(200).json({
      msg: 'rolesDelete',
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  rolesGet,
  rolesGetByUuid,
  rolesPut,
  rolesDelete,
  rolesPost,
};
