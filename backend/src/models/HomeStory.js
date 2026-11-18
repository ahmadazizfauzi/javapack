const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HomeStory extends Model {
    static associate() {}
  }

  HomeStory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      customer_name: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      gear_tag: {
        type: DataTypes.STRING(120),
        allowNull: false
      },
      testimonial: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      image_url: {
        type: DataTypes.STRING(255),
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
      modelName: 'HomeStory',
      tableName: 'home_stories',
      timestamps: true,
      paranoid: true,
      underscored: true
    }
  );

  return HomeStory;
};
