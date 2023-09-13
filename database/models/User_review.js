module.exports = (sequelize, DataTypes) => {

    const alias = 'UserReview'
  const cols = {
    uuid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    rating_value: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  };

  const config = {
    tableName: 'user_review',
    timestamps: 'true',
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
  };

  const UserReview = sequelize.define(alias, cols, config);

  // Define las asociaciones según tu estructura de datos

  return UserReview;
};
