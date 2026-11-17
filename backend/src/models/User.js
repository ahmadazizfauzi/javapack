const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Order, { foreignKey: 'user_id', as: 'orders' });
    }

    toJSON() {
      const values = { ...this.get() };
      delete values.password;
      return values;
    }
  }

  User.init(
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
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
      },
      avatar_url: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      role: {
        type: DataTypes.ENUM('admin', 'customer'),
        allowNull: false,
        defaultValue: 'customer'
      },
      last_login_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      underscored: true
    }
  );

  return User;
};
