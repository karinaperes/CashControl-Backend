const { DataTypes } = require("sequelize") // Importando o componente DataTypes do Sequelize
const { connection } = require("../database/connection")

const Classe = connection.define('classes', {
	nome_classe: {
		type: DataTypes.STRING,
        allowNull: false
	},
    tipo_mov_id: {
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
