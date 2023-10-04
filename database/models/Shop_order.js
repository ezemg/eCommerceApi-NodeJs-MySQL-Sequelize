module.exports = (sequelize, DataTypes) => {
  const alias = 'ShopOrder';
  const cols = {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: sequelize.models.User,
        key: 'id',
      },
    },
    uuid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    payment_method_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: sequelize.models.PaymentMethod,
        key: 'id',
      },
    },
    shipping_address_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: sequelize.models.ShippingAddress,
        key: 'id',
      },
    },
    shipping_method_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: sequelize.models.ShippingMethod,
        key: 'id',
      },
    },
    order_total: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    order_status_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: sequelize.models.OrderStatus,
        key: 'id',
      },
    },

    ref_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    invoice_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  };

  const config = {
    tableName: 'shop_order',
    timestamps: 'true',
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
  };

  const ShopOrder = sequelize.define(alias, cols, config);

  ShopOrder.associate = (models) => {
    ShopOrder.belongsTo(models.Address, {
      foreignKey: 'shipping_address_id',
      as: 'address',
    });

    ShopOrder.belongsTo(models.OrderStatus, {
      foreignKey: 'order_status_id',
      as: 'order_status',
    });

    ShopOrder.belongsTo(models.PaymentMethod, {
      foreignKey: 'payment_method_id',
      as: 'payment_method',
    });

    ShopOrder.belongsToMany(models.ProductItem, {
      as: 'product_item',
      through: models.OrderLine,
      foreignKey: 'shop_order_id',
      otherKey: 'product_item_id',
    });

    ShopOrder.hasMany(models.OrderLine, {
      as: 'order_line',
      foreignKey: 'shop_order_id',
    });

    // OJO CON EL ALIAS ACÁ HUBO PROBLEMAS
    ShopOrder.belongsTo(models.ShippingMethod, {
      as: 'shippingMethod',
      foreignKey: 'shipping_method_id',
    });

    ShopOrder.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  };

  return ShopOrder;
};
