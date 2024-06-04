const { DataTypes } = require("sequelize") // Importando o componente DataTypes do Sequelize
const { connection } = require("../database/connections")

const Movimento = connection.define('movimentos', {
	data: {
		type: DataTypes.DATE,
        allowNull: false
	},
    vencimento: {
        type: DataTypes.DATE,
        allowNull: false
    },    
    valor: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    descricao: {
        type: DataTypes.STRING        
    },
    data_pagamento: {
        type: DataTypes.DATE,
        allowNull: false 
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
