const { Router } = require("express");
const MovimentoController = require("../controllers/MovimentoController");
const movimentoRoutes = new Router();

movimentoRoutes.post("/", MovimentoController.cadastrar);
movimentoRoutes.get("/", MovimentoController.listar);
movimentoRoutes.get("/:id", MovimentoController.listarUm);
movimentoRoutes.put("/:id", MovimentoController.atualizar);
movimentoRoutes.delete("/:id", MovimentoController.excluir);

module.exports = movimentoRoutes;
