const Conta = require('../models/Conta');
const { Op } = require('sequelize');
const { body, validationResult } = require('express-validator');

class ContaController {
  async cadastrar(req, res) {
    try {
      await body('nome_conta')
        .notEmpty()
        .withMessage('O nome é obrigatório')
        .custom((value) => {
          if (value.trim().length === 0) {
            throw new Error('O nome não pode conter apenas espaços em branco');
          }
          return true;
        })
        .run(req);

      await body('usuario_id')
        .isInt()
        .withMessage('Informe o usuário')
        .run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { nome_conta } = req.body;

      if (!nome_conta) {
        return res
          .status(400)
          .json({ erro: 'Todos os campos devem ser preenchidos!' });
      }

      const contaExistente = await Conta.findOne({
        where: {
          nome_conta: nome_conta,
        },
      });

      if (contaExistente) {
        return res.status(409).json({ mensagem: 'Conta já cadastrada!' });
      }

      const conta = await Conta.create(req.body);

      res.status(201).json(conta);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ erro: 'Não foi possível cadastrar a conta.' });
    }
  }

  async listar(req, res) {
    try {
      const contas = await Conta.findAll();
      res.status(200).json(contas);
    } catch (error) {
      res.status(500).json({ erro: 'Não foi possível listar as contas.' });
    }
  }

  async listarUm(req, res) {
    try {
      const { id } = req.params;
      const conta = await Conta.findByPk(id);

      res.status(200).status(conta);
    } catch (error) {
      console.log(error.messge);
      res.status(500).json({ erro: 'Não foi possível listar a conta.' });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const conta = await Conta.findByPk(id);

      const contaExistente = await Conta.findOne({
        where: {
          nome_conta: req.body.nome_conta,
          id: { [Op.ne]: id }, // Exclui o próprio registro da verificação
        },
      });

      if (contaExistente) {
        return res.status(409).json({ mensagem: 'Conta já cadastrada!' });
      }

      await conta.update(req.body);
      await conta.save();
      res.status(200).json({ mensagem: 'Alteração efetuada com sucesso!' });
    } catch (error) {
      res.status(500).json({ erro: 'Não foi possível atualizar a conta.' });
    }
  }

  async excluir(req, res) {
    try {
      const { id } = req.params;

      const movimentoVinculado = await Movimento.findOne({
        where: {
          conta_id: id,
        },
      });

      if (movimentoVinculado) {
        return res.status(400).json({
          erro: 'Esta conta está vinculada a um movimento e não pode ser excluída.',
        });
      }

      const conta = await Conta.findByPk(id);

      await conta.destroy();
      res.status(200).json({ mensagem: 'conta excluída com sucesso!' });
    } catch (error) {
      res.status(500).json({ erro: 'Não foi possível excluir a conta.' });
    }
  }
}

module.exports = new ContaController();
