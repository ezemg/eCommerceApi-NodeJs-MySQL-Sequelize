const db = require('../database/models');

const isValidRole = async (role = '') => {};

const emailExists = async (email = '') => {
  const emailExists = await db.User.findOne({
    where: { email_address: email },
  });

  if (emailExists) {
    throw new Error(`email: ${email} is already in use`);
  }
};

const userExistsByUuid = async (user = '') => {};

const categoryExistsByUuid = async (category = '') => {};

const productExistsByUuid = async (uuid) => {};

module.exports = {
  categoryExistsByUuid,
  emailExists,
  isValidRole,
  productExistsByUuid,
  userExistsByUuid,
};
