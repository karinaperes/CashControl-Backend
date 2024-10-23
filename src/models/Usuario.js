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
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

Usuario.beforeSave(async (user) => {
    user.password = await hash(user.password, 8)
    return user
})

module.exports = Usuario
