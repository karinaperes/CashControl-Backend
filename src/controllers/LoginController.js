const Usuario = require('../models/Usuario')

class LoginController {
    async logar(req, res) {
        try {
            const email = req.body.email
            const password = req.body.password

            if (!email) {
                return res.status(400).json({ erro: 'Informe o email' })
            }
            if (!password) {
                return res.status(400).json({ erro: 'Informe a senha' })
            }

            const usuario = await Usuario.findOne({
                where: { email: email }
            })
            if (!usuario) {
                return res.status(404).json({ erro: 'Email e senha não correspondem a nenhum usuário' })
            }

            const hashSenha = await compare(password, usuario.password)
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
