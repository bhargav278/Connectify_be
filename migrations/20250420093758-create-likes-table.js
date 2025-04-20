'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Likes',{
      likeId : {
        type : Sequelize.UUID,
        defaultValue : Sequelize.UUIDV4,
        primaryKey:true,
      },
      postId:{
        type : Sequelize.UUID,
        allowNull : false,
        references : {
          model : 'Posts',
          key : "postId",
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      personId : {
        type : Sequelize.UUID,
        allowNull : false,
        references : {
          model : 'Users',
          key : 'userId',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      isDisliked : {
        type : Sequelize.BOOLEAN,
        defaultValue : false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Likes')
  }
};
