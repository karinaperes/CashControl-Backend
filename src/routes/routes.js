const { Router } = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const loginRoutes = require("./login.routes");
const usuarioRoutes = require("./usuario.routes");
const classeRoutes = require("./classe.routes");
const contaRoutes = require("./conta.routes");
const movimentoRoutes = require("./movimento.routes");
const tipoMovRoutes = require("./tipo_mov.routes");

const routes = Router();

routes.use("/login", loginRoutes);
routes.use("/usuario", usuarioRoutes);
routes.use("/classe", authMiddleware, classeRoutes);
routes.use("/conta", authMiddleware, contaRoutes);
routes.use("/movimento", authMiddleware, movimentoRoutes);
routes.use("/tipomov", authMiddleware, tipoMovRoutes);

module.exports = routes;
