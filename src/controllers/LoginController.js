const Usuario = require("../models/Usuario");
const { body, validationResult } = require("express-validator");
const { compare } = require("bcrypt");
const { sign } = require("jsonwebtoken");

class LoginController {
  async logar(req, res) {
    try {
      await body("email")
        .isEmail()
        .withMessage("Email inválido")
        .custom((value) => {
          if (value.trim().length === 0) {
            throw new Error("O email não pode conter apenas espaços em branco");
          }
          return true;
        })
        .run(req);
      await body("senha")
        .isLength({ min: 4 })
        .withMessage("A senha deve ter pelo menos 4 caracteres")
        .custom((value) => {
          if (value.trim().length === 0) {
            throw new Error("A senha não pode conter apenas espaços em branco");
          }
          return true;
        })
        .run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const email = req.body.email;
      const senha = req.body.senha;

      const usuario = await Usuario.findOne({
        where: { email: email },
      });
      if (!usuario) {
        return res
          .status(404)
          .json({ erro: "Email não corresponde a nenhum usuário" });
      }

      const hashSenha = await compare(senha, usuario.senha);
      if (!hashSenha) {
        return res.status(400).json({ mensagem: "Senha inválida" });
      }

      const payload = {
        sub: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
      };
      const token = sign(payload, process.env.SECRET_JWT);

      res.status(200).json({ Token: token });
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ erro: "Solicitação não pôde ser atendida" });
    }
  }
}

module.exports = new LoginController();
