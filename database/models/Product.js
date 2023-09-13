module.exports = (sequelize, DataTypes) => {

    const alias = 'Product'
  const cols = {
    uuid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    product_image: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    product_category_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.TINYINT(4),
      allowNull: false,
      defaultValue: 0,
    },
  };

  const config = {
    tableName: 'product',
    timestamps: 'true',
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
  };

  const Product = sequelize.define(alias, cols, config);

  Product.associate = (models) => {
    // Asociación con ProductCategory basada en el script original
    Product.belongsTo(models.ProductCategory, {
      as: 'product_category',
      foreignKey: 'product_category_id',
    });

    // Asociación con ProductItem basada en el script original
    Product.hasMany(models.ProductItem, {
      as: 'product_items',
      foreignKey: 'product_id',
    });
  };

  return Product;
};
