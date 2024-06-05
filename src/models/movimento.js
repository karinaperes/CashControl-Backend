const {DataTypes} = require("sequelize")
const {connection} = require("../database/connections")

const Movimento = connection.define('movimentos', {
    data: {
        allowNull: false,
        type: DataTypes.DATEONLY
    },
    vencimento: {
        allowNull: false,
        type: DataTypes.DATEONLY
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
    }
})

module.exports = Movimento
