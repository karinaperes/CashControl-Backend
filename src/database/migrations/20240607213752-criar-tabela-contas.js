'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('contas', { 
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false
      },
      conta: {
        type: Sequelize.STRING,
        allowNull: false
      }  
    });
     
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('contas');
    
  }
};
