const { DataTypes } = require("sequelize") // Importando o componente DataTypes do Sequelize
const { connection } = require("../database/connection")

const TipoMov = connection.define('tipo_mov', {
	tipo_mov: {
		type: DataTypes.STRING,
        allowNull: false
	}
})

module.exports = TipoMov
