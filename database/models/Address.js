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
    country_id: {
      type: dataTypes.INTEGER,
    },
  };

  const config = {
    tableName: 'address',
    timestamps: 'true',
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
  };

  const Address = sequelize.define(alias, cols, config);

  Address.associate = (models) => {
    Address.belongsTo(models.Address, {
      as: 'country',
      foreignKey: 'country_id',
    });
  };

  return Address;
};
