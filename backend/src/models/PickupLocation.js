const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PickupLocation extends Model {
    static associate(models) {
      this.hasMany(models.Product, { foreignKey: 'pickup_location_id', as: 'products' });
      this.hasMany(models.Order, { foreignKey: 'pickup_location_id', as: 'orders' });
    }
  }

  PickupLocation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      operational_hours: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'PickupLocation',
      tableName: 'pickup_locations',
      timestamps: true,
      underscored: true
    }
  );

  return PickupLocation;
};
