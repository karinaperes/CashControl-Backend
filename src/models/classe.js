const { DataTypes } = require("sequelize") // Importando o componente DataTypes do Sequelize
const { connection } = require("../database/connection")

const Classe = connection.define('classe', {
	classe: {
		type: DataTypes.STRING,
        allowNull: false
	},
    tipo_mov_ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'TipoMov',
            key: 'id'
        }        
    }
})

module.exports = Classe
