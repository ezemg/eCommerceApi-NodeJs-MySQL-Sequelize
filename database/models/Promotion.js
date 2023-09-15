module.exports = (sequelize, DataTypes) => {
  const alias = 'Promotion';
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
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    discount_rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    is_active: {
      type: DataTypes.TINYINT(4),
      allowNull: false,
      defaultValue: 1,
    },
  };

  const config = {
    tableName: 'promotion',
    timestamps: 'true',
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
  };

  const Promotion = sequelize.define(alias, cols, config);

  Promotion.associate = (models) => {
    Promotion.belongsToMany(models.ProductCategory, {
      as: 'product_category',
      through: models.PromotionCategory,
      foreignKey: 'promotion_id',
    });
  };

  return Promotion;
};
