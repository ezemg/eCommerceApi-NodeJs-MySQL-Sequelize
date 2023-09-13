module.exports = (sequelize, DataTypes) => {
  const alias = 'VariationOption';
  const cols = {
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

  return VariationOption;
};
