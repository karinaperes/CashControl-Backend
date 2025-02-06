const TipoMov = require('../models/TipoMov')
const Classe = require('../models/Classe')
const { body, validationResult } = require('express-validator')

class TipoMovController {
    async cadastrar(req, res) {
        try {
            await body('nome_tipo_mov').notEmpty().withMessage('Informe o nome do tipo de movimento.').custom(value => {
                if (value.trim().length === 0) {
                    throw new Error('O tipo de movimento não pode conter apenas espaços em branco')
                }
                return true
            }).run(req)
                
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const tipoMovExistente = await TipoMov.findOne({
                where: {
                    nome_tipo_mov: nome_tipo_mov
                }
            })

            if (tipoMovExistente) {
                return res.status(409).json({ mensagem: 'Tipo de movimento já cadastrado!'})
            }

            const tipoMov = await TipoMov.create(req.body)
            
            res.status(201).json(tipoMov)

        } catch (error) {
            console.log(error.message)
            res.status(500).json({ erro: 'Não foi possível efetuar o cadastro do tipo de movimento.'})
        }
    }

    async listar(req, res) {
        try {
            const tipoMovs = await TipoMov.findAll()
            res.status(200).json(tipoMovs)
        } catch (error) {
            res.status(500).json({ erro: 'Não foi possível listar os tipos de movimentos.'})
        }
    }

    async listarUm(req, res) {
        try {
            const { id } = req.params
            const tipoMov = await TipoMov.findByPk(id)

            res.status(200).json(tipoMov)
            
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ erro: 'Não foi possível listar o tipo de movimento.'})
        }
    }

    async atualizar(req, res) {
        try {
            await body('nome_tipo_mov').notEmpty().withMessage('Informe o nome do tipo de movimento.').run(req)
                
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() })
            }

            const { id } = req.params
            const tipoMov = await TipoMov.findByPk(id)

            const tipoMovExistente = await TipoMov.findOne({
                where: {
                    nome_tipo_mov: req.body.nome_tipo_mov,
                    id: { [Op.ne]: id } // Exclui o próprio registro da verificação
                }
            })
            
            if (tipoMovExistente) {
                return res.status(409).json({ mensagem: 'Tipo de movimento já cadastrado!' })
            }

            await tipoMov.update(req.body)
            await tipoMov.save()
            res.status(200).json({ mensagem: 'Alteração efetuada com sucesso!'})
            
        } catch (error) {
            res.status(500).json({ erro: 'Não foi possível atualizar o tipo de movimento.'})
        }
    }

    async excluir(req, res) {
        try {
            const { id } = req.params

            const classeVinculada = await Classe.findOne({
                where: {
                    tipo_mov_id: id
                }
            })

            if (classeVinculada) {
                return res.status(400).json({ erro: 'Este tipo de movimento está vinculado a uma classe e não pode ser excluído.' })
            }

            const tipoMov = await TipoMov.findByPk(id)
            await tipoMov.destroy()            
            res.status(200).json({ mensagem: 'Tipo de movimento excluído com sucesso!'})

        } catch (error) {
            res.status(500).json({ erro: 'Não foi possível excluir o tipo de movimento.'})
        }
    }
}

module.exports = new TipoMovController()
