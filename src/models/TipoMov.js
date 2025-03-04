const { DataTypes } = require("sequelize") // Importando o componente DataTypes do Sequelize
const { connection } = require("../database/connection")

const TipoMov = connection.define('tipos_movs', {
	nome_tipo_mov: {
		type: DataTypes.STRING,
        allowNull: false,
		unique: true
	},
	usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
}, {
    timestamps: true    
});

module.exports = TipoMov
