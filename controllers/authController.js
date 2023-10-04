const { response } = require('express');
const bcryptjs = require('bcryptjs');
const db = require('../database/models');
const { Sequelize } = require('sequelize');

const { JWTGenerator } = require('../helpers/JWTGenerator.js');

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe en DB
    const user = await db.User.findOne({
      where: { email_address: email },
      attributes: [
        'uuid',
        'email_address',
        'phone_number',
        'is_active',
        'password',
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

    if (!user) {
      return res.status(400).json({
        msg: 'User / Password do not match the records - email',
      });
    }
    // Verificar si el usuario está activo en DB
    // Todavia tengo que arreglar el isActive en DB !!!!!!!!!!
    // if (!usuario.is_active) {
    //   return res.status(400).json({
    //     msg: 'Usuario / Password no son correctos - estado: false',
    //   });
    // }

    // Verify password
    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - password',
      });
    }

    // Generar JWT
    const token = await JWTGenerator(user.uuid);

    res.json({
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: 'Contact Admin',
    });
  }
};

module.exports = {
  login,
};
