const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
      this.belongsTo(models.PickupLocation, { foreignKey: 'pickup_location_id', as: 'pickupLocation' });
    }
  }

  Order.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      order_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      pickup_location_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      duration_days: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      price_per_day: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
      },
      total_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('pending_payment', 'paid', 'active_rent', 'completed'),
        allowNull: false,
        defaultValue: 'pending_payment'
      },
      payment_reference: {
        type: DataTypes.STRING(150),
        allowNull: true
      },
      payment_url: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      pickup_token: {
        type: DataTypes.STRING(64),
        allowNull: true,
        unique: true
      }
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'orders',
      timestamps: true,
      underscored: true
    }
  );

  return Order;
};
