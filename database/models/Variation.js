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

  // Define las asociaciones según tu estructura de datos

  return Variation;
};
