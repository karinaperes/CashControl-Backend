const { DataTypes } = require("sequelize") // Importando o componente DataTypes do Sequelize
const { connection } = require("../database/connections")

const TipoMov = connection.define('tipos_mov', {
	tipo_mov: {
		type: DataTypes.STRING,
        allowNull: false
	}
})

module.exports = TipoMov
