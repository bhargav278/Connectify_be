'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ConnectionRequest extends Model {
    static associate(models) {
      // Associations to User
      ConnectionRequest.belongsTo(models.User, {
        foreignKey: 'senderId',
        targetKey:'userId',
        as: 'Sender'
      });
      ConnectionRequest.belongsTo(models.User, {
        foreignKey: 'receiverId',
        targetKey: 'userId',
        as: 'Receiver'
      });
      ConnectionRequest.hasOne(models.Connection, {
        foreignKey: 'requestId',
        as: 'Connection',
      });
    }
  }

  ConnectionRequest.init(
    {
      requestId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      senderId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      receiverId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'canceled', 'disconnected'),
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      modelName: 'ConnectionRequest',
      tableName: 'ConnectionRequests',
      timestamps: true,
    }
  );

  return ConnectionRequest;
};
