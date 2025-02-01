const Movimento = require('../models/Movimento')

class MovimentoController {
    async cadastrar(req, res) {
        try {
            const { data, vencimento, descricao, classe_id, valor } = req.body

            if (!(data || vencimento || valor)) {
                return res.status(400).json({ erro: 'Todos os campos devem ser preenchidos!'})
            }           

            const movimento = await Movimento.create(req.body)
            
            res.status(201).json(movimento)

        } catch (error) {
            console.log(error.message)
            res.status(500).json({ erro: 'Não foi possível efetuar o cadastro.'})
        }
    }

    async listar(req, res) {
        try {
            const movimentos = await Movimento.findAll()
            res.status(200).json(movimentos)
        } catch (error) {
            res.status(500).json({ erro: 'Não foi possível listar os movimentos financeiros.'})
        }
    }

    async listarUm(req, res) {
        try {
            const { id } = req.params
            const movimento = await Movimento.findByPk(id)

            res.status(200).json(movimento)
            
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ erro: 'Não foi possível listar o movimento.'})
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params
            const movimento = await Movimento.findByPk(id)

            await movimento.update(req.body)
            await movimento.save()
            res.status(200).json({ mensagem: 'Alteração efetuada com sucesso!'})
            
        } catch (error) {
            res.status(500).json({ erro: 'Não foi possível atualizar o movimento.'})
        }
    }

    async excluir(req, res) {
        try {
            const { id } = req.params
            const movimento = await Movimento.findByPk(id)

            await movimento.destroy()
            res.status(200).json({ mensagem: 'Movimento excluído com sucesso!'})

        } catch (error) {
            res.status(500).json({ erro: 'Não foi possível excluir o movimento.'})
        }
    }
}

module.exports = new MovimentoController()
