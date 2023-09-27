module.exports = (sequelize, DataTypes) => {
  const alias = 'ProductConfiguration';
  const cols = {
    product_item_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: sequelize.models.ProductItem,
        key: 'id',
      },
    },
    variation_option_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: sequelize.models.VariationOption,
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
    tableName: 'product_configuration',
    timestamps: 'true',
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
  };

  const ProductConfiguration = sequelize.define(alias, cols, config);

  // ProductConfiguration.associate = (models) => {
  //   ProductConfiguration.belongsTo(models.ProductItem, {
  //     as: 'product_item',
  //     foreignKey: 'id',
  //   });
  //   ProductConfiguration.belongsTo(models.VariationOption, {
  //     as: 'variation_option',
  //     foreignKey: 'id',
  //   });
  // };
  return ProductConfiguration;
};
