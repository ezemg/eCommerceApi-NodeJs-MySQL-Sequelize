module.exports = (sequelize, DataTypes) => {
  const alias = 'ProductCategory';
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
    parent_category_id: {
      type: DataTypes.INTEGER(11),
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
    updatedAt: 'updated_at',
  };

  const ProductCategory = sequelize.define(alias, cols, config);

  // ProductCategory.beforeCreate(async (category, options) => {
  //   if (!category.parent_category_id) {
  //     category.parent_category_id = category.id;
  //   }
  // });

  ProductCategory.associate = (models) => {
    ProductCategory.hasMany(models.ProductCategory, {
      as: 'product_category',
      foreignKey: 'parent_category_id',
    });

    ProductCategory.belongsTo(models.ProductCategory, {
      as: 'product_category_parent',
      foreignKey: 'parent_category_id',
    });

    ProductCategory.belongsToMany(models.Promotion, {
      as: 'promotion',
      through: models.PromotionCategory,
      foreignKey: 'product_category_id',
    });

    ProductCategory.hasMany(models.Product, {
      as: 'product',
      foreignKey: 'product_category_id',
    });

    ProductCategory.hasMany(models.Variation, {
      as: 'variation',
      foreignKey: 'product_category_id',
    });
  };

  return ProductCategory;
};
