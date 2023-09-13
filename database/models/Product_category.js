module.exports = (sequelize, DataTypes) => {

    const alias = 'ProductCategory'
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
    parent_category_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    category_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
   
    is_active: {
      type: DataTypes.TINYINT(4),
      allowNull: false,
      defaultValue: 0,
    },
  };

  const config = {
    tableName: 'product_category',
    timestamps: 'true',
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',  };

  const ProductCategory = sequelize.define(alias, cols, config);

  ProductCategory.associate = (models) => {
    // Asociación con sí misma para categorías secundarias
    ProductCategory.hasMany(models.ProductCategory, {
      as: 'sub_categories',
      foreignKey: 'parent_category_id',
    });

    // Asociación con Product basada en el script original
    ProductCategory.hasMany(models.Product, {
      as: 'products',
      foreignKey: 'product_category_id',
    });
  };

  return ProductCategory;
};
