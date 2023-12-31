module.exports = (sequelize, DataTypes) => {
  const alias = 'Variation';
  const cols = {
    uuid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
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
    tableName: 'variation',
    timestamps: 'true',
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
  };

  const Variation = sequelize.define(alias, cols, config);

  Variation.associate = (models) => {
    Variation.belongsTo(models.ProductCategory, {
      as: 'product_category',
      foreignKey: 'product_category_id',
    });

    Variation.hasMany(models.VariationOption, {
      as: 'variation_option',
      foreignKey: 'variation_id',
    });
  };

  return Variation;
};
