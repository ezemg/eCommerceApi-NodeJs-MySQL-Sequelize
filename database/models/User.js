module.exports = (sequelize, DataTypes) => {
  const alias = 'User';

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
    email_address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone_number: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    is_active: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
  };

  const config = {
    tableName: 'user',
    timestamps: 'true',
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
  };

  const User = sequelize.define(alias, cols, config);

  User.associate = (models) => {
    User.hasMany(models.UserAddress, {
      as: 'addresses',
      foreignKey: 'user_id',
    });

    User.hasMany(models.UserReview, {
      as: 'reviews',
      foreignKey: 'user_id',
    });

    User.belongsToMany(models.Roles, {
      as: 'roles',
      through: models.UserRoles,
      foreignKey: 'user_id',
    });
  };

  return User;
};
