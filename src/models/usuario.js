const { DataTypes } = require("sequelize") // Importando o componente DataTypes do Sequelize
const { connection } = require("../database/connections")

const Usuario = connection.define('usuarios', {
	nome: {
		type: DataTypes.STRING,
        allowNull: false
	},
    email: {
        type: DataTypes.STRING,
        allowNull: false        
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Usuario
