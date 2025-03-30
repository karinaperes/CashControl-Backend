const { Router } = require("express");
const { listarMovimentos, graficoReceitaDespesa } = require("../controllers/RelatorioController");

const relatorioRoutes = Router();

relatorioRoutes.get("/movimentos", listarMovimentos);
relatorioRoutes.get("/grafico", graficoReceitaDespesa);

module.exports = relatorioRoutes;