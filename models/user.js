'use strict';
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.ConnectionRequest, {
        foreignKey: 'senderId',
        as: 'SentRequests'
      });
      User.hasMany(models.ConnectionRequest, {
        foreignKey: 'receiverId',
        as: 'ReceivedRequests'
      });
      User.hasMany(models.Connection, {
        foreignKey: 'senderId',
        as: 'SentConnections',
      });
      User.hasMany(models.Connection, {
        foreignKey: 'receiverId',
        as: 'ReceivedConnections',
      });
    }
  }

  User.init(
    {
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey:true,
      },
      firstName: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      emailId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 16,
        },
      },
      gender: {
        type: DataTypes.ENUM('male', 'female', 'other'),
        allowNull: false,
      },
      phoneNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      about: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: true, // Automatically manages createdAt & updatedAt
    }
  );

  return User;
};
