const { response } = require('express');
const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const db = require('../database/models');

const { Sequelize, User, UserRoles } = db;

const usersGet = async (req, res = response) => {
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

const usersGetByUuid = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { uuid: req.params.uuid },
      attributes: [
        'uuid',
        'email_address',
        'phone_number',
        'is_active',
        [Sequelize.literal('roles.name'), 'role_name'],
      ],
      include: [
        {
          model: db.Roles,
          as: 'roles',
          attributes: [],
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

const usersPut = (req, res = response) => {
  const id = req.params.id;

  res.status(500).json({
    msg: 'put API - controlador',
    id,
  });
};
const usersPost = async (req, res = response) => {
  let { email_address, password, phone_number } = req.body;

  try {
    const result = await db.sequelize.transaction(async (t) => {
      const user = await User.build(
        {
          email_address,
          password,
          phone_number,
          uuid: uuidv4(),
        },
        { transaction: t }
      );
      const salt = bcryptjs.genSaltSync(10);

      user.password = bcryptjs.hashSync(password, salt);

      await user.save({ transaction: t });

      await UserRoles.create(
        {
          user_id: user.id,
          roles_id: 1,
          uuid: uuidv4(),
        },
        { transaction: t }
      );

      return user;
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};
const usersPatch = (req, res = response) => {
  res.status(201).json({
    msg: 'post PATCH - controlador',
  });
};
const usersDelete = (req, res = response) => {
  res.json({
    msg: 'delete API - controlador',
  });
};

module.exports = {
  usersGet,
  usersPut,
  usersPost,
  usersPatch,
  usersDelete,
  usersGetByUuid,
};
