const { DataTypes } = require("sequelize") // Importando o componente DataTypes do Sequelize
const { connection } = require("../database/connections")

const Classe = connection.define('classes', {
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
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
})

module.exports = Classe
