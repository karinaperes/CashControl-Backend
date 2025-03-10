const { Router } = require('express');
const ContaController = require('../controllers/ContaController');
const contaRoutes = new Router();

contaRoutes.post('/', ContaController.cadastrar);
contaRoutes.get('/', ContaController.listar);
contaRoutes.get('/:id', ContaController.listarUm);
contaRoutes.put('/:id', ContaController.atualizar);
contaRoutes.delete('/:id', ContaController.excluir);

module.exports = contaRoutes;
