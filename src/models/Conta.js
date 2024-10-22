const { DataTypes } = require("sequelize") // Importando o componente DataTypes do Sequelize
const { connection } = require("../database/connections")

const Conta = connection.define('contas', {
	nome_conta: {
		type: DataTypes.STRING,
        allowNull: false
	}
})

module.exports = Conta
