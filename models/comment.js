'use strict';
const { Model} = require('sequelize');

module.exports = (sequelize , DataTypes) => {
    class Comment extends Model{
        static associate(models){
            Comment.belongsTo(models.User, {
                foreignKey : "personId",
                targetKey : "userId",
                as : "Person"
            });
            Comment.belongsTo(models.Post, {
                foreignKey : "postId",
                targetKey : "postId",
                as : "Post"
            })
        }
    }

    Comment.init(
        {
            commentId  :  {
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
            comment : {
                type : DataTypes.TEXT,
                allowNull : false
            },
            isDeleted : {
                type : DataTypes.BOOLEAN,
                defaultValue : false,
            }
        },
        {
            sequelize,
            modelName : "Comment",
            tableName : "Comments",
            timestamps : true,
        }
    )
    return Comment;
}