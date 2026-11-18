const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Faq extends Model {
    static associate() {}
  }

  Faq.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      question: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'Faq',
      tableName: 'faqs_contents',
      timestamps: true,
      underscored: true
    }
  );

  return Faq;
};
