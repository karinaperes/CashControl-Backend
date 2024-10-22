const { Router } = require('express')
const ClasseController = require('../controllers/ClasseController')
const classeRoutes = new Router()

classeRoutes.post('/',ClasseController.cadastrar)
classeRoutes.get('/', ClasseController.listar)
classeRoutes.get('/:id', ClasseController.listarUm)
classeRoutes.put('/:id', ClasseController.atualizar)
classeRoutes.delete('/:id', ClasseController.excluir)

module.exports = classeRoutes
