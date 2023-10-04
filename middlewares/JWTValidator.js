const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const db = require('../database/models');

const JWTValidator = async (req = request, res = response, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    const user = await db.User.findOne({ where: { uuid: uid } });

    // LOGICA DE FIND EN DB

    if (!user) {
      return res.status(401).json({
        msg: 'Token is not valid - User does not exist',
      });
    }

    // REVISAR isActive en DB
    // if (!usuario.isActive) {
    //   // Verificar si el UID pertenece a estado true
    //   return res.status(401).json({
    //     msg: 'Token is not valid - User is not active',
    //   });
    // }

    req.user = { uuid: user.uuid, email_address: user.email_address };

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'contact admin' });
  }
};

module.exports = {
  JWTValidator,
};
