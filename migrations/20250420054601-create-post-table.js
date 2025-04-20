'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Posts',{
      postId : {
        type : Sequelize.UUID,
        primaryKey : true,
        defaultValue: Sequelize.UUIDV4
      },
      ownerId : {
        type : Sequelize.UUID,
        allowNull : false,
        references : {
          model : 'Users',
          key : 'userId'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      imagePath : {
        type : Sequelize.STRING,
        allowNull : false,
      },
      caption : {
        type : Sequelize.TEXT,
        allowNull  :true,
      },
      likes : {
        type : Sequelize.INTEGER,
        defaultValue: 0,
        allowNull:false,
      },
      comments : {
        type : Sequelize.INTEGER,
        defaultValue : 0,
        allowNull:false,
      },
      isDeleted : {
        type : Sequelize.BOOLEAN,
        defaultValue : false
      },
      isPublic :  {
        type : Sequelize.BOOLEAN,
        defaultValue : false,
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
    await queryInterface.dropTable("Posts")
  }
};
