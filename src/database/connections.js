const {Sequelize} = require('sequelize') // Importando o componente Sequelize do Sequelize
const databaseConfig = require('../config/database.config')
const connection = new Sequelize(databaseConfig)
module.exports = {connection}