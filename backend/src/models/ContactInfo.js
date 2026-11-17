const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ContactInfo extends Model {
    static associate() {}
  }

  ContactInfo.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      location_title: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      location_subtitle: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      whatsapp: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      operating_hours: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      latitude: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      longitude: {
        type: DataTypes.STRING(50),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'ContactInfo',
      tableName: 'contact_infos',
      timestamps: true,
      underscored: true
    }
  );

  return ContactInfo;
};
