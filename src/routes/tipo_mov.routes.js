const { Router } = require("express");
const TipoMovController = require("../controllers/TipoMovController");
const tipoMovRoutes = new Router();

tipoMovRoutes.post("/", TipoMovController.cadastrar);
tipoMovRoutes.get("/", TipoMovController.listar);
tipoMovRoutes.get("/:id", TipoMovController.listarUm);
tipoMovRoutes.put("/:id", TipoMovController.atualizar);
tipoMovRoutes.delete("/:id", TipoMovController.excluir);

module.exports = tipoMovRoutes;
