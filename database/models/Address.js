module.exports = (sequelize, dataTypes) => {
  const alias = 'Address';

  const cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    address_line: {
      type: dataTypes.STRING,
    },
    city: {
      type: dataTypes.STRING,
    },
    region: {
      type: dataTypes.STRING,
    },
    postal_code: {
      type: dataTypes.STRING(45),
    },
  };

  const config = {
    tableName: 'address',
  };

  const Address = sequelize.define(alias, cols, config);

  return Address;
};
