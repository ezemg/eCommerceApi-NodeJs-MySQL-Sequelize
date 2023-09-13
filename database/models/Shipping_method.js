module.exports = (sequelize, DataTypes) => {
  const alias = 'ShippingMethod';
  const cols = {
    uuid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

    is_active: {
      type: DataTypes.TINYINT(4),
      allowNull: false,
      defaultValue: 0,
    },
  };

  const config = {
    tableName: 'shipping_method',
    timestamps: 'true',
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
  };

  const ShippingMethod = sequelize.define(alias, cols, config);

  // Define las asociaciones según tu estructura de datos

  return ShippingMethod;
};