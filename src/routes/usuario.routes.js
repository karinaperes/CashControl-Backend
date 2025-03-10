const { Router } = require("express");
const UsuarioController = require("../controllers/UsuarioController");
const usuarioRoutes = new Router();

usuarioRoutes.post("/", UsuarioController.cadastrar);
usuarioRoutes.get("/", UsuarioController.listar);
usuarioRoutes.get("/:id", UsuarioController.listarUm);
usuarioRoutes.put("/:id", UsuarioController.atualizar);
usuarioRoutes.delete("/:id", UsuarioController.excluir);

module.exports = usuarioRoutes;
