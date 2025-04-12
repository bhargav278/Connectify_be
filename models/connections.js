'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Connection extends Model {
        static associate(models) {
            // Associations
            Connection.belongsTo(models.User, {
                foreignKey: 'senderId',
                as: 'Sender',
            });

            Connection.belongsTo(models.User, {
                foreignKey: 'receiverId',
                as: 'Receiver',
            });

            Connection.belongsTo(models.ConnectionRequest, {
                foreignKey: 'requestId',
                as: 'Request',
            });
        }
    }

    Connection.init(
        {
            connectionId: {
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
            requestId: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            isDisconnected: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            sequelize,
            modelName: 'Connection',
            tableName: 'Connections',
            timestamps: true,
        }
    );

    return Connection;
};
