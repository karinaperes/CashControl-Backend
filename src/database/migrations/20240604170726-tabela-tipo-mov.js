'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tipos_mov', { 
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false
      },
      tipo_mov: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });    
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tipos_mov');     
  }
};
