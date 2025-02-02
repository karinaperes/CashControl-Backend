const {DataTypes} = require("sequelize")
const {connection} = require("../database/connection")
const {hash} = require('bcrypt')

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

Usuario.beforeSave(async (user) => {
    user.senha = await hash(user.senha, 8)
    return user
})

module.exports = Usuario
