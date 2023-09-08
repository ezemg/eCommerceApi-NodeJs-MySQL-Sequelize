const { response } = require('express');
const db = require('../database/models');
const { Sequelize, Address, Country } = db;
const { v4: uuidv4 } = require('uuid');

const addressGet = async (req, res = response) => {
  try {
    const address = await Address.findAll({
      attributes: [
        'uuid',
        'address_line',
        'city',
        'region',
        'postal_code',
        [Sequelize.literal('country.country_name'), 'country_name'],
      ],
      include: {
        model: db.Country,
        as: 'country',
        attributes: [],
      },
    });

    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ msg: 'Contacte al Admin' });
  }
};

const addressGetByUuid = async (req, res = response) => {
  try {
    const address = await Address.findOne({
      where: { uuid: req.params.uuid },
      attributes: [
        'uuid',
        'address_line',
        'city',
        'region',
        'postal_code',
        [Sequelize.literal('country.country_name'), 'country_name'],
      ],
      include: {
        model: db.Country,
        as: 'country',
        attributes: [],
      },
    });

    address
      ? res.status(200).json(address)
      : res.status(404).json({ msg: 'Address Not Found' });
  } catch (error) {
    console.log(error);
  }
};

const addressPost = async (req, res = response) => {
  try {
    const { body } = req;

    const uuid = uuidv4();

    // Creo la instancia de objeto
    let address = await Address.build({ ...body, uuid });

    // Guardado fisico en DB
    address = await address.save();
    res.json(address.toJSON());
  } catch (error) {
    console.log(error);
  }
};

const countryGet = async (req, res = response) => {
  try {
    const countries = await Country.findAll({
      attributes: ['country_name', 'uuid'],
      order: [['id', 'ASC']],
    });

    res.status(200).json(countries);
  } catch (error) {
    console.log(error);
  }
};

const countryGetByUuid = async (req, res = response) => {
  try {
    const country = await Country.findOne({
      where: { uuid: req.params.uuid },
      attributes: ['country_name', 'uuid'],
    });

    country
      ? res.status(200).json(country)
      : res.status(404).json({ msg: 'Country Not Found' });
  } catch (error) {
    console.log(error);
  }
};

const countryPost = async (req, res = response) => {
  try {
    const { body } = req;

    const uuid = uuidv4();

    const country = await db.Country.build({ ...body, uuid });

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
  addressGetByUuid,
  addressPost,
  countryGet,
  countryGetByUuid,
  countryPost,
};
