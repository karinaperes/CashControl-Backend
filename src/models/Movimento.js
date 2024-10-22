const { DataTypes } = require("sequelize") // Importando o componente DataTypes do Sequelize
const { connection } = require("../database/connection")

const Movimento = connection.define('movimentos', {
	data: {
    type: DataTypes.DATEONLY,
    allowNull: false	    
	},
  vencimento: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },    
  valor: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2)
    // adicionar validação para decimal com vírgula
  }, 
  descricao: {
    allowNull: false,
    type: DataTypes.STRING   
  }, 
  data_pagamento: {
    allowNull: false,
    type: DataTypes.DATEONLY
  },
  classe_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Classe',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'        
   },
   conta_id: {
     type: DataTypes.INTEGER,
     allowNull: false,
     references: {       
       model: 'Conta',
       key: 'id'
     },
     onUpdate: 'CASCADE',
     onDelete: 'CASCADE'        
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuario',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
})

module.exports = Movimento
