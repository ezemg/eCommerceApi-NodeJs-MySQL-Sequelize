module.exports = (sequelize, DataTypes) => {
  const alias = 'UserAddress';
  const cols = {
    uuid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    is_default: {
      type: DataTypes.TINYINT(4),
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: sequelize.model.User,
        key: 'id',
      },
    },
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: sequelize.model.Address,
        key: 'id',
      },
    },
    is_active: {
      type: DataTypes.TINYINT(4),
      allowNull: false,
    },
  };

  const config = {
    tableName: 'user_address',
    timestamps: 'true',
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
  };

  const UserAddress = sequelize.define(alias, cols, config);

  // Define las asociaciones según tu estructura de datos

  return UserAddress;
};
