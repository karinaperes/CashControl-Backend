const { Router } = require('express')
const { body, validationResult } = require('express-validator')
const UsuarioController = require('../controllers/UsuarioController')
const { EmptyResultError } = require('sequelize')
const usuarioRoutes = new Router()

usuarioRoutes.post(
    '/', 
    [
        body('nome').notEmpty().withMessage('O nome é obrigatório'),
        body('email').isEmail().withMessage('Email inválido'),
        body('senha').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
    ],
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        next()
    },
    UsuarioController.cadastrar
)
usuarioRoutes.get('/', UsuarioController.listar)
usuarioRoutes.get('/:id', UsuarioController.listarUm)
usuarioRoutes.put('/:id', UsuarioController.atualizar)
usuarioRoutes.delete('/:id', UsuarioController.excluir)

module.exports = usuarioRoutes
