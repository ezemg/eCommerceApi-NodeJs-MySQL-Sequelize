module.exports = (sequelize, DataTypes) => {
  const alias = 'Roles';
  const cols = {
    id: {
      type: DataTypes.INTEGER(11),
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      unique: true,
    },
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
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: '0',
    },
  };

  const config = {
    tableName: 'roles',
    timestamps: 'true',
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
  };

  const Roles = sequelize.define(alias, cols, config);

  Roles.associate = (models) => {
    Roles.belongsToMany(models.User, {
      as: 'users',
      through: models.UserRoles,
      foreignKey: 'roles_id',
    });
  };

  // Define las asociaciones según tu estructura de datos

  return Roles;
};
