const { Router } = require('express');
const { RelatorioController } = require('../controllers/RelatorioController');

const relatorioRoutes = new Router();

relatorioRoutes.get('/', RelatorioController);

module.exports = relatorioRoutes;