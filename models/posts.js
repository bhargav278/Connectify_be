'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        static associate(models){
            Post.belongsTo(models.User,{
                foreignKey : 'ownerId',
                targetKey : 'userId',
                as : "Owner"
            });
            Post.hasOne(models.Like,{
                foreignKey : "postId",
                sourceKey : "postId",
            })
            Post.hasOne(models.Comment, {
                foreignKey : "postId",
                sourceKey : "postId",
            })
        }
    }
    Post.init(
        {
            postId : {
                type : DataTypes.UUID,
                defaultValue : DataTypes.UUIDV4,
                primaryKey : true,
            },
            ownerId : {
                type : DataTypes.UUID,
                allowNull : false,
            },
            imagePath : {
                type : DataTypes.STRING,
                allowNull:false,
            },
            caption : {
                type : DataTypes.TEXT,
                allowNull : true,
            },
            likes : {
                type : DataTypes.INTEGER,
                allowNull : false,
                defaultValue : 0,
            },
            comments : {
                type : DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            isDeleted : {
                type : DataTypes.BOOLEAN,
                defaultValue : false
            },
            isPublic :  {
                type : DataTypes.BOOLEAN,
                defaultValue : false,
            }
        },
        {
            sequelize,
            modelName : "Post",
            tableName : "Posts",
            timestamps : true,
        }
    );
    return Post
}
