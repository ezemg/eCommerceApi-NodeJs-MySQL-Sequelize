module.exports = (sequelize, DataTypes) => {
  const alias = 'UserRoles';

  const cols = {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: sequelize.models.User,
        key: 'id',
      },
    },

    roles_id: {
      type: DataTypes.INTEGER,
      references: {
        model: sequelize.models.Roles,
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
    tableName: 'user_roles',
    timestamps: 'true',
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
  };

  const UserRoles = sequelize.define(alias, cols, config);

  // Define las asociaciones según tu estructura de datos

  return UserRoles;
};
