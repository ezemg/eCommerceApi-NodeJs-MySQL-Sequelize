const { response } = require('express');
const db = require('../database/models');

const addressGet = (req, res = response) => {
  res.status(200).json({
    msg: 'get address - API',
    status: 'ok',
  });
};

const addressPost = async (req, res = response) => {
  try {
    const { body } = req;

    const address = await db.Address.build(body);

    address.save();
    console.log(address);
    res.json({ msg: 'UN EXITO' });
  } catch (error) {
    console.log(error);
  }
};

const countryGet = async (req, res = response) => {
  try {
    const countries = await db.Country.findAll();

    res.status(200).json(countries);
  } catch (error) {
    console.log(error);
  }
};

const countryPost = async (req, res = response) => {
  try {
    const { body } = req;

    const country = await db.Country.build(body);

    country.save();

    res.status(200).json({
      msg: 'Todo salio bien',
      status: 'ok',
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addressGet,
  addressPost,
  countryGet,
  countryPost,
};
