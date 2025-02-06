const Usuario = require('../models/Usuario')
const { body, validationResult } = require('express-validator')

class UsuarioController {
    async cadastrar(req, res) {
        try {
            await body('nome').notEmpty().withMessage('O nome é obrigatório').custom(value => {
                if (value.trim().length === 0) {
                    throw new Error('O nome não pode conter apenas espaços em branco')
                }
                return true
            }).run(req)
            await body('email').isEmail().withMessage('Email inválido').custom(value => {
                if (value.trim().length === 0) {
                    throw new Error('O email não pode conter apenas espaços em branco')
                }
                return true
            }).run(req)
            await body('senha').isLength({ min: 4 }).withMessage('A senha deve ter pelo menos 4 caracteres').custom(value => {
                if (value.trim().length === 0) {
                    throw new Error('A senha não pode conter apenas espaços em branco')
                }
                return true
            }).run(req)

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
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
            await body('nome').notEmpty().withMessage('O nome é obrigatório').run(req)
            await body('email').isEmail().withMessage('Email inválido').run(req)
            await body('senha').isLength({ min: 4 }).withMessage('A senha deve ter pelo menos 4 caracteres').run(req)

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const { id } = req.params
            const usuario = await Usuario.findByPk(id)

            const emailExistente = await Usuario.findOne({
                where: {
                    email: req.body.email,
                    id: { [Op.ne]: id } // Exclui o próprio registro da verificação
                }
            })
            
            if (emailExistente) {
                return res.status(409).json({ mensagem: 'Email já cadastrado!' })
            }

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
