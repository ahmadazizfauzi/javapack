const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HeroBanner extends Model {
    static associate() {}
  }

  HeroBanner.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      subtitle: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      image_url: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      cta_text: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      cta_link: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      sort_order: {
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
      modelName: 'HeroBanner',
      tableName: 'hero_banners',
      timestamps: true,
      underscored: true
    }
  );

  return HeroBanner;
};
