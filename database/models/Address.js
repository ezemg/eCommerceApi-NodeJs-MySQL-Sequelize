module.exports = (sequelize, dataTypes) => {
  const alias = 'Address';

  const cols = {
    id: {
      type: dataTypes.INTEGER(11),
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
    uuid: {
      type: dataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    is_active: {
      type: dataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
  };

  const config = {
    tableName: 'address',
    paranoid: true,
    timestamps: 'true',
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
  };

  const Address = sequelize.define(alias, cols, config);

  Address.associate = (models) => {
    Address.belongsTo(models.Country, {
      as: 'country',
      foreignKey: 'country_id',
    });
  };

  return Address;
};
