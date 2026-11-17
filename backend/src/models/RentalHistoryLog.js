const { Model } = require('sequelize');

function throwImmutableError() {
  const error = new Error('rental_history_logs is append-only and cannot be modified or deleted');
  error.statusCode = 403;
  throw error;
}

module.exports = (sequelize, DataTypes) => {
  class RentalHistoryLog extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      this.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
      this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
    }
  }

  RentalHistoryLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      order_code: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      product_name: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      duration_days: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      total_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false
      },
      event_status: {
        type: DataTypes.STRING(40),
        allowNull: false
      },
      note: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'RentalHistoryLog',
      tableName: 'rental_history_logs',
      paranoid: false,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
      underscored: true,
      hooks: {
        beforeDestroy: throwImmutableError,
        beforeBulkDestroy: throwImmutableError
      }
    }
  );

  return RentalHistoryLog;
};
