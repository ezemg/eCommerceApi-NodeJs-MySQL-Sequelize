module.exports = (sequelize, DataTypes) => {
  const alias = 'PromotionCategory';
  const cols = {
    product_category_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    promotion_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    uuid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    is_active: {
      type: DataTypes.TINYINT(4),
      allowNull: false,
      defaultValue: 0,
    },
  };

  const config = {
    tableName: 'promotion_category',
    timestamps: 'true',
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
  };

  const PromotionCategory = sequelize.define(alias, cols, config);

  PromotionCategory.associate = (models) => {
    // Asociación con Promotion basada en el script original
    PromotionCategory.belongsTo(models.Promotion, {
      as: 'promotion',
      foreignKey: 'promotion_id',
    });

    // Asociación con ProductCategory basada en el script original
    PromotionCategory.belongsTo(models.ProductCategory, {
      as: 'product_category',
      foreignKey: 'product_category_id',
    });
  };

  return PromotionCategory;
};
