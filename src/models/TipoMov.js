const { DataTypes } = require("sequelize") // Importando o componente DataTypes do Sequelize
const { connection } = require("../database/connection")

const TipoMov = connection.define('tipos_movimentos', {
	nome_tipo_mov: {
		type: DataTypes.STRING,
        allowNull: false,
		unique: true
	},
	usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuario',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
})

module.exports = TipoMov
