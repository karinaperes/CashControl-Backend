const { DataTypes } = require("sequelize") 
const { connection } = require("../database/connections")

const Classe = connection.define('classes', {
	classe: {
        allowNull: false,
        type: DataTypes.STRING
	}
})

module.exports = Classe
