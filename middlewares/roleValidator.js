const { request, response } = require('express');

const isAdminRole = async (req = request, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: 'Trying to verify role without token validation',
    });
  }

  const { role, name } = req.user;

  if (role !== 2) {
    return res.status(401).json({
      msg: `${name} does not have admin credentials - Access denied`,
    });
  }

  next();
};

const hasRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: 'Trying to verify role without token validation',
      });
    }

    if (!roles.includes(req.usuario.role)) {
      return res.status(401).json({
        msg: `Service requires one of this roles: ${roles}`,
      });
    }
    next();
  };
};

module.exports = {
  isAdminRole,
  hasRole,
};
