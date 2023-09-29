module.exports = (sequelize, DataTypes) => {
  const alias = 'ShippingMethod';
  const cols = {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
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

  ShippingMethod.associate = (models) => {
    ShippingMethod.hasMany(models.ShopOrder, {
      foreignKey: 'shipping_method_id',
      as: 'shop_order',
    });

    ShippingMethod.belongsToMany(models.User, {
      through: models.ShopOrder,
      foreignKey: 'shipping_method_id',
      as: 'user',
    });
  };

  return ShippingMethod;
};
