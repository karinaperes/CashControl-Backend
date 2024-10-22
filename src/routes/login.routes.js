const { Router } = require('express')
const LoginController = require('../controllers/LoginController')
const loginRoutes = new Router()

loginRoutes.post('/', LoginController.logar)

module.exports = loginRoutes
