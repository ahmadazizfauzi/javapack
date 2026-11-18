const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HomeStep extends Model {
    static associate() {}
  }

  HomeStep.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      step_label: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      sort_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'HomeStep',
      tableName: 'home_steps',
      timestamps: true,
      paranoid: true,
      underscored: true
    }
  );

  return HomeStep;
};
