const {DataTypes} = require("sequelize")
const {connection} = require("../database/connections")

const Conta = connection.define('contas', {
    conta: {
        allowNull: false,
        type: DataTypes.STRING
    }
})

module.exports = Conta
