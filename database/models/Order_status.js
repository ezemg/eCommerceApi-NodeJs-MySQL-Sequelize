module.exports = (sequelize, DataTypes) => {
  const alias = 'OrderStatus';
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
    status: {
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
    tableName: 'order_status',
    timestamps: 'true',
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
  };

  const OrderStatus = sequelize.define(alias, cols, config);

  OrderStatus.associate = (models) => {
    OrderStatus.hasMany(models.ShopOrder, {
      as: 'shop_order',
      foreignKey: 'order_status_id',
    });
  };

  return OrderStatus;
};
