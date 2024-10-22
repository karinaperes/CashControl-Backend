const { Router } = require('express')
const loginRoutes = require('./login.routes')
const usuarioRoutes = require('./usuario.routes')
const classeRoutes = require('./classe.routes')
const contaRoutes = require('./conta.routes')
const movimentoRoutes = require('./movimento.routes')
const tipoMovRoutes = require('./tipo_mov.routes')

const routes = Router()

routes.use('/login', loginRoutes)
routes.use('/usuario', usuarioRoutes)
routes.use('/classe', classeRoutes)
routes.use('/conta', contaRoutes)
routes.use('/movimento', movimentoRoutes)
routes.use('/tipomov', tipoMovRoutes)

module.exports = routes
