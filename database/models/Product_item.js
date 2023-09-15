module.exports = (sequelize, DataTypes) => {
  const alias = 'ProductItem';
  const cols = {
    product_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    uuid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    SKU: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    qty_in_stock: {
      type: DataTypes.BIGINT(20),
      allowNull: true,
    },
    product_image: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    tableName: 'product_item',
    timestamps: 'true',
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
  };

  const ProductItem = sequelize.define(alias, cols, config);

  ProductItem.associate = (models) => {
    ProductItem.belongsToMany(models.VariationOption, {
      as: 'variation_option',
      through: models.ProductConfiguration,
      foreignKey: 'product_item_id',
    });

    ProductItem.belongsTo(models.Product, {
      as: 'product',
      foreignKey: 'product_id',
    });

    ProductItem.belongsToMany(models.ShopOrder, {
      as: 'shop_order',
      through: models.OrderLine,
      foreignKey: 'product_item_id',
    });
  };

  return ProductItem;
};
