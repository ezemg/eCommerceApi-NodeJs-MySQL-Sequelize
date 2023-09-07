module.exports = (sequelize, dataTypes) => {
  const alias = 'Country';

  const cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
      unique: true,
    },
    country_name: {
      type: dataTypes.STRING,
      unique: true,
    },
  };

  const config = {
    tableName: 'country',
    timestamps: 'true',
    createdAt: 'inserted_at',
    updatedAt: 'updated_at',
  };

  const Country = sequelize.define(alias, cols, config);

  Country.associate = (models) => {
    Country.hasMany(models.Address, {
      as: 'Address',
      foreignKey: 'country_id',
    });
  };

  return Country;
};
