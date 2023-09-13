module.exports = (sequelize, DataTypes) => {

    const alias = 'ShopOrder'
  const cols = {
    uuid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    order_total: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    ref_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    invoice_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  };

  const config = {
    tableName: 'shop_order',
    timestamps: 'true',
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
  };

  const ShopOrder = sequelize.define(alias, cols, config);

  // Define las asociaciones según tu estructura de datos

  return ShopOrder;
};
