module.exports = (sequelize, DataTypes) => {
  const alias = 'VariationOption';
  const cols = {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
    },
    variation_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: sequelize.models.Variation,
        key: 'id',
      },
    },
    uuid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.TINYINT(4),
      allowNull: false,
      defaultValue: 0,
    },
  };

  const config = {
    tableName: 'variation_option',
    timestamps: 'true',
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
  };

  const VariationOption = sequelize.define(alias, cols, config);

  // Define las asociaciones según tu estructura de datos

  VariationOption.associate = (models) => {
    VariationOption.belongsToMany(models.ProductItem, {
      through: models.ProductConfiguration,
      as: 'product_configuration',
      foreignKey: 'variation_option_id',
    });
    VariationOption.belongsTo(models.Variation, {
      foreignKey: 'variation_id',
      as: 'variation',
    });
  };

  return VariationOption;
};
