module.exports = (sequelize, DataTypes) => {
  const alias = 'OrderLine';
  const cols = {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
    },
    uuid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    product_item_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    shop_order_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    qty: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    is_active: {
      type: DataTypes.TINYINT(4),
      allowNull: false,
      defaultValue: 0,
    },
  };

  const config = {
    tableName: 'order_line',
    timestamps: 'true',
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
  };

  const OrderLine = sequelize.define(alias, cols, config);

  OrderLine.associate = (models) => {
    OrderLine.belongsTo(models.ProductItem, {
      as: 'product_item',
      foreignKey: 'product_item_id',
    });

    OrderLine.belongsTo(models.ShopOrder, {
      as: 'shop_order',
      foreignKey: 'shop_order_id',
    });

    OrderLine.hasOne(models.UserReview, {
      as: 'user_review',
      foreignKey: 'order_line_id',
    });
  };

  return OrderLine;
};
