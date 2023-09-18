const { response } = require('express');
const db = require('../database/models');

const { Sequelize, User, Roles, Product, ProductItem } = db;

const usuariosGet = async (req, res = response) => {
  try {
    const user = await db.User.findAll({
      attributes: [
        'uuid',
        'email_address',
        'phone_number',
        'is_active',
        [Sequelize.literal('roles.name'), 'role_name'],
      ],
      include: {
        model: db.Roles,
        as: 'roles',
        attributes: [],
      },
    });

    res.json(user);
  } catch (error) {
    console.log(error);
  }
  // const { user = 'Undefined User', nombre = 'Undefined Name' } = req.query;
  // res.json({
  //   msg: 'get API - controlador',
  //   user,
  //   nombre,
  // });
};

const usuariosGetByUuid = async (req, res) => {
  try {
    // const user = await User.findOne({
    //   where: { uuid: req.params.uuid },
    //   attributes: [
    //     'uuid',
    //     'email_address',
    //     'phone_number',
    //     'is_active',
    //     [Sequelize.literal('roles.name'), 'role_name'],
    //   ],
    //   include: [
    //     {
    //       model: db.Roles,
    //       as: 'roles',
    //       attributes: [],
    //     },
    //   ],
    // });

    const user = await ProductItem.findOne({
      where: { uuid: req.params.uuid },
      // attributes: [
      //   'uuid',
      //   'email_address',
      //   'phone_number',
      //   'is_active',
      //   [Sequelize.literal('roles.name'), 'role_name'],
      // ],
      attributes: [
        'uuid',
        'SKU',
        'qty_in_stock',
        'is_active',
        [Sequelize.literal('product.name'), 'product_name'],
        [Sequelize.literal('variation_option.value'), 'value'],
      ],
      include: [
        {
          model: db.Product,
          as: 'product',

          // attributes: [],
        },
        {
          model: db.VariationOption,
          as: 'variation_option',
          include: [{ model: db.Variation, as: 'variation' }],

          // attributes: [],
        },
      ],
    });

    // console.log(user[0].variation_option.map(el => el.value));
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Contacte al Admin' });
  }
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
  usuariosGetByUuid,
};
