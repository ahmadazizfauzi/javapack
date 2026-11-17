const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ContactMessage extends Model {
    static associate() {}
  }

  ContactMessage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      subject: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('unread', 'read'),
        allowNull: false,
        defaultValue: 'unread'
      }
    },
    {
      sequelize,
      modelName: 'ContactMessage',
      tableName: 'contact_messages',
      timestamps: true,
      underscored: true
    }
  );

  return ContactMessage;
};
