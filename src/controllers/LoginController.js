const Usuario = require('../models/Usuario')
const { body, validationResult } = require('express-validator')

class LoginController {
    async logar(req, res) {
        try {
            await body('email').isEmail().withMessage('Email inválido').run(req)
            await body('senha').isLength({ min: 4 }).withMessage('A senha deve ter pelo menos 4 caracteres').run(req)

            const email = req.body.email
            const senha = req.body.senha

            if (!email) {
                return res.status(400).json({ erro: 'Informe o email' })
            }
            if (!senha) {
                return res.status(400).json({ erro: 'Informe a senha' })
            }

            const usuario = await Usuario.findOne({
                where: { email: email }
            })
            if (!usuario) {
                return res.status(404).json({ erro: 'Email não corresponde a nenhum usuário' })
            }

            const hashSenha = await compare(senha, usuario.senha)
            if(hashSenha === false) {
                return res.status(400).json({ mensagem: 'Senha inválida' })
            }

            const payload = { sub: usuario.id, email: usuario.email, nome: usuario.nome }
            const token = sign(payload, process.env.SECRET_JWT)

            res.status(200).json({ Token: token })

        } catch (error) {   
            console.log(error.message)         
            return res.status(500).json({ erro: 'Solicitação não pôde ser atendida' })            
        }
    }    
}

module.exports = new LoginController()
