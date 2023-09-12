const { response } = require('express');
const db = require('../database/models');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

const { Sequelize, Address, Country } = db;

// Address CRUD
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
    const address = await Address.build({ ...body, uuid });

    // Guardado fisico en DB
    await address.save();

    res.status(200).json({
      msg: 'Todo salio bien',
      status: 'ok',
    });
  } catch (error) {
    console.log(error);
  }
};

const addressPut = async (req, res = response) => {
  const { body } = req;
  try {
    await Address.update(body, { where: { uuid: req.params.uuid } });

    res.status(200).json({
      msg: 'Entry edited',
    });
  } catch (error) {
    console.log(error);
  }
};

const addressDelete = async (req, res = response) => {
  try {
    await Address.update(
      { is_active: 1 },
      { where: { uuid: req.params.uuid } }
    );

    res.status(200).json({ msg: 'Eliminado' });
  } catch (error) {
    console.log(error);
  }
};

// Country CRUD
const countryGet = async (req, res = response) => {
  try {
    const { name } = req.query;

    const opts = {
      where: {},
      attributes: ['country_name', 'uuid'],
      order: [['id', 'ASC']],
    };

    if (name !== undefined && name !== '')
      opts.where.country_name = {
        [Op.like]: `%${name}%`,
      };

    const countries = await Country.findAll(opts);

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

const countryPut = async (req, res = response) => {
  const { body } = req;
  try {
    await Country.update(body, { where: { uuid: req.params.uuid } });

    res.status(200).json({
      msg: 'Entry edited',
    });
  } catch (error) {
    console.log(error);
  }
};

const countryDelete = async (req, res = response) => {
  try {
    await Country.update(
      { is_active: 1 },
      { where: { uuid: req.params.uuid } }
    );

    res.status(200).json({ msg: 'Eliminado' });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addressDelete,
  addressGet,
  addressGetByUuid,
  addressPost,
  addressPut,
  countryDelete,
  countryGet,
  countryGetByUuid,
  countryPost,
  countryPut,
};
