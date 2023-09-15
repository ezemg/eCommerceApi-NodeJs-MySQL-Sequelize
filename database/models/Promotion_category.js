module.exports = (sequelize, DataTypes) => {
  const alias = 'PromotionCategory';
  const cols = {
    product_category_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: sequelize.models.ProductCategory,
        key: 'id',
      },
    },
    promotion_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: sequelize.models.Promotion,
        key: 'id',
      },
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

  return PromotionCategory;
};
