module.exports = (sequelize, DataTypes) => {
  const alias = 'PaymentMethod';
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
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    is_active: {
      type: DataTypes.TINYINT(4),
      allowNull: false,
      defaultValue: 0,
    },
  };

  const config = {
    tableName: 'payment_method',
    timestamps: 'true',
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
  };

  const PaymentMethod = sequelize.define(alias, cols, config);

  PaymentMethod.associate = (models) => {
    PaymentMethod.hasMany(models.ShopOrder, {
      as: 'shop_order',
      foreignKey: 'payment_method_id',
    });

    PaymentMethod.belongsToMany(models.User, {
      through: models.ShopOrder,
      as: 'user',
      foreignKey: 'user_id',
    });
  };

  return PaymentMethod;
};
