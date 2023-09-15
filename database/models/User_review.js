module.exports = (sequelize, DataTypes) => {
  const alias = 'UserReview';
  const cols = {
    uuid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: sequelize.model.User,
        key: 'id',
      },
    },
    order_line_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: sequelize.model.OrderLine,
        key: 'id',
      },
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

  UserReview.associate = (models) => {
    UserReview.belongsTo(models.OrderLine, {
      as: 'order_line',
      foreignKey: 'order_line_id',
    });

    UserReview.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'user_id',
    });
  };

  // Define las asociaciones según tu estructura de datos

  return UserReview;
};
