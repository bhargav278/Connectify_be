'use strict';
const { Model} = require('sequelize');

module.exports = (sequelize , DataTypes) => {
    class Like extends Model{
        static associate(models){
            Like.belongsTo(models.User, {
                foreignKey : "personId",
                targetKey : "userId",
                as : "Person"
            });
            Like.belongsTo(models.Post, {
                foreignKey : "postId",
                targetKey : "postId",
                as : "Post"
            })
        }
    }

    Like.init(
        {
            likeId  :  {
                type : DataTypes.UUID,
                defaultValue : DataTypes.UUIDV4,
                primaryKey : true
            },
            postId : {
                type : DataTypes.UUID,
                allowNull : false
            },
            personId : {
                type : DataTypes.UUID,
                allowNull : false,
            },
            isDisliked : {
                type : DataTypes.BOOLEAN,
                defaultValue : false,
            }
        },
        {
            sequelize,
            modelName : "Like",
            tableName : "Likes",
            timestamps : true,
        }
    )
    return Like;
}