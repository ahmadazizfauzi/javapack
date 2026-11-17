const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HomeContent extends Model {
    static associate() {}
  }

  HomeContent.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      badge_text: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      headline: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      subheadline: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'HomeContent',
      tableName: 'home_contents',
      timestamps: true,
      underscored: true
    }
  );

  return HomeContent;
};
