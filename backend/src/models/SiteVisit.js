const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SiteVisit extends Model {
    static associate() {}
  }

  SiteVisit.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      visitor_token: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      visitor_type: {
        type: DataTypes.ENUM('new', 'returning'),
        allowNull: false,
        defaultValue: 'new'
      },
      page: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'home'
      },
      user_agent: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      visit_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'SiteVisit',
      tableName: 'site_visits',
      timestamps: true,
      underscored: true
    }
  );

  return SiteVisit;
};
