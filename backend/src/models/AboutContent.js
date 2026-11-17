const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AboutContent extends Model {
    static associate() {}
  }

  AboutContent.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      eyebrow: {
        type: DataTypes.STRING(150),
        allowNull: false,
        defaultValue: 'WHY CHOOSE JAVAPACK?'
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      banner_image_url: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      side_image_url: {
        type: DataTypes.STRING(255),
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'AboutContent',
      tableName: 'about_contents',
      timestamps: true,
      underscored: true
    }
  );

  return AboutContent;
};
