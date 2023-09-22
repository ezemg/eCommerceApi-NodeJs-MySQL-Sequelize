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
    User.belongsToMany(models.Address, {
      as: 'address',
      through: models.UserAddress,
      foreignKey: 'user_id',
    });

    User.belongsToMany(models.PaymentMethod, {
      as: 'payment_method',
      through: models.ShopOrder,
      foreignKey: 'user_id',
    });

    User.belongsToMany(models.Roles, {
      as: 'roles',
      through: models.UserRoles,
      foreignKey: 'user_id',
    });

    User.belongsToMany(models.ShippingMethod, {
      as: 'shipping_method',
      through: models.ShopOrder,
      foreignKey: 'user_id',
    });
    User.hasMany(models.ShopOrder, {
      as: 'shop_order',
      foreignKey: 'user_id',
    });

    User.belongsToMany(models.OrderLine, {
      as: 'order_line',
      through: models.UserReview,
      foreignKey: 'user_id',
    });

    User.hasMany(models.UserReview, {
      as: 'user_review',
      foreignKey: 'user_id',
    });

    // No se si incluir o no esta relacion
    // User.belongsToMany(models.OrderStatus, {
    //   as: 'order_status',
    //   through: models.ShopOrder,
    //   foreignKey: 'user_id',
    // });
  };
  User.prototype.toJSON = function () {
    let values = Object.assign({}, this.get());

    delete values.password;
    delete values.id;
    return values;
  };

  return User;
};
