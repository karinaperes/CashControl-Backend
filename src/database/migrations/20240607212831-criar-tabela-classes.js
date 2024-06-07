'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('classes', { 
      id: {
        primaryKey:true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false        
      },
      classe: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tipo_move_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tipos_mov',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    });     
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('classes'); 
  }
};
