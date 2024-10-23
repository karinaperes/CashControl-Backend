const Usuario = require('../models/Usuario')

class UsuarioController {
    async cadastrar(req, res) {
        try {
            const { nome, email, password } = req.body

            if (!(nome || email || password)) {
                return res.status(400).json({ erro: 'Todos os campos devem ser preenchidos!'})
            }

            const emailExistente = await Usuario.findOne({
                where: {
                    email: email
                }
            })

            if (emailExistente) {
                return res.status(409).json({ mensagem: 'Email já cadastrado!'})
            }

            const usuario = await Usuario.create(req.body)
            
            res.status(201).json(usuario)

        } catch (error) {
            console.log(error.message)
            res.status(500).json({ erro: 'Não foi possível efetuar o cadastro do usuário.'})
        }
    }

    async listar(req, res) {
        try {
            const usuarios = await Usuario.findAll()
            res.status(200).json(usuarios)
        } catch (error) {
            res.status(500).json({ erro: 'Não foi possível listar os usuários.'})
        }
    }

    async listarUm(req, res) {
        try {
            const { id } = req.params
            const usuario = await Usuario.findByPk(id)

            res.status(200).json(usuario)
            
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ erro: 'Não foi possível listar o usuário'})
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params
            const usuario = await Usuario.findByPk(id)

            await usuario.update(req.body)
            await usuario.save()
            res.status(200).json({ mensagem: 'Alteração efetuada com sucesso!'})
            
        } catch (error) {
            res.status(500).json({ erro: 'Não foi possível atualizar o usuário.'})
        }
    }

    async excluir(req, res) {
        try {
            const { id } = req.params
            const usuario = await Usuario.findByPk(id)

            await usuario.destroy()
            res.status(200).json({ mensagem: 'Usuário excluído com sucesso!'})

        } catch (error) {
            res.status(500).json({ erro: 'Não foi possível excluir o usuário.'})
        }
    }
}

module.exports = new UsuarioController()
