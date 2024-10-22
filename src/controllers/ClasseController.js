const Classe = require('../models/Classe')

class ClasseController {
    async cadastrar(req, res) {
        try {
            const { nome_classe, tipo_mov_ID } = req.body

            if (!nome_classe || tipo_mov_ID) {
                return res.status(400).json({ erro: 'Todos os campos devem ser preenchidos!'})
            }

            const classeExistente = await Classe.findOne({
                where: {
                    nome_classe: nome_classe
                }
            })

            if (classeExistente) {
                return res.status(409).json({ mensagem: 'Classe já cadastrada!'})
            }

            const classe = await Classe.create(req.body)
            
            res.status(201).json(classe)

        } catch (error) {
            console.log(error.message)
            res.status(500).json({ erro: 'Não foi possível efetuar o cadastro da classe.'})
        }
    }

    async listar(req, res) {
        try {
            
        } catch (error) {
            
        }
    }

    async atualizar(req, res) {
        try {
            
        } catch (error) {
            
        }
    }

    async excluir(req, res) {
        try {
            
        } catch (error) {
            
        }
    }
}

module.exports = new ClasseController()
