const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      this.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
      this.belongsTo(models.PickupLocation, { foreignKey: 'pickup_location_id', as: 'pickupLocation' });
      this.hasMany(models.Order, { foreignKey: 'product_id', as: 'orders' });
    }
  }

  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      pickup_location_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING(180),
        allowNull: false,
        unique: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      image_url: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      price_per_day: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'products',
      timestamps: true,
      underscored: true
    }
  );

  return Product;
};
