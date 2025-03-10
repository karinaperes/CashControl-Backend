const Classe = require('../models/Classe');
const Movimento = require('../models/Movimento');
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');

class ClasseController {
  async cadastrar(req, res) {
    try {
      await body('nome_classe')
        .notEmpty()
        .withMessage('O nome é obrigatório')
        .custom((value) => {
          if (value.trim().length === 0) {
            throw new Error('O nome não pode conter apenas espaços em branco');
          }
          return true;
        })
        .run(req);
      await body('tipo_mov_id')
        .isInt()
        .withMessage('Informe o tipo de movimento')
        .run(req);

      await body('usuario_id')
        .isInt()
        .withMessage('Informe o usuário')
        .run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { nome_classe } = req.body;

      const classeExistente = await Classe.findOne({
        where: {
          nome_classe: nome_classe,
        },
      });

      if (classeExistente) {
        return res.status(409).json({ mensagem: 'Classe já cadastrada!' });
      }

      const classe = await Classe.create(req.body);

      res.status(201).json(classe);
    } catch (error) {
      console.log(error.message);
      res
        .status(500)
        .json({ erro: 'Não foi possível efetuar o cadastro da classe.' });
    }
  }

  async listar(req, res) {
    try {
      const classes = await Classe.findAll();
      res.status(200).json(classes);
    } catch (error) {
      res.status(500).json({ erro: 'Não foi possível listar as classes.' });
    }
  }

  async listarUm(req, res) {
    try {
      const { id } = req.params;
      const classe = await Classe.findByPk(id);

      res.status(200).json(classe);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ erro: 'Não foi possível listar a classe' });
    }
  }

  async atualizar(req, res) {
    try {
      await body('nome_classe')
        .notEmpty()
        .withMessage('O nome é obrigatório')
        .run(req);
      await body('tipo_mov_id')
        .isInt()
        .withMessage('Informe o tipo de movimento')
        .run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const classe = await Classe.findByPk(id);

      const classeExistente = await Classe.findOne({
        where: {
          nome_classe: req.body.nome_classe,
          id: { [Op.ne]: id }, // Exclui o próprio registro da verificação
        },
      });

      if (classeExistente) {
        return res.status(409).json({ mensagem: 'Classe já cadastrada!' });
      }

      await classe.update(req.body);
      await classe.save();
      res.status(200).json({ mensagem: 'Alteração efetuada com sucesso!' });
    } catch (error) {
      res.status(500).json({ erro: 'Não foi possível atualizar a classe.' });
    }
  }

  async excluir(req, res) {
    try {
      const { id } = req.params;

      const movimentoVinculado = await Movimento.findOne({
        where: {
          classe_id: id,
        },
      });

      if (movimentoVinculado) {
        return res.status(400).json({
          erro: 'Esta classe está vinculada a um movimento e não pode ser excluída.',
        });
      }

      const classe = await Classe.findByPk(id);
      await classe.destroy();
      res.status(200).json({ mensagem: 'Classe excluída com sucesso!' });
    } catch (error) {
      res.status(500).json({ erro: 'Não foi possível excluir a classe.' });
    }
  }
}

module.exports = new ClasseController();
