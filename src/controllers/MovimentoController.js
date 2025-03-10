const Movimento = require('../models/Movimento');
const { body, validationResult } = require('express-validator');

class MovimentoController {
  async cadastrar(req, res) {
    try {
      await body('data')
        .isDate()
        .withMessage('Insira uma data de competência válida')
        .run(req);
      await body('vencimento')
        .isDate()
        .withMessage('Insira uma data de vencimento válida')
        .run(req);
      await body('classe_id')
        .isInt()
        .withMessage('Selecione uma classe')
        .run(req);
      await body('valor')
        .isFloat()
        .withMessage('O valor deve ser inserido')
        .custom((value) => {
          if (!/^\d+(\.\d{2})$/.test(value)) {
            throw new Error('O valor deve ter exatamente duas casas decimais');
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

      const movimento = await Movimento.create(req.body);

      res.status(201).json(movimento);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ erro: 'Não foi possível efetuar o cadastro.' });
    }
  }

  async listar(res) {
    try {
      const movimentos = await Movimento.findAll();
      res.status(200).json(movimentos);
    } catch (error) {
      res
        .status(500)
        .json({ erro: 'Não foi possível listar os movimentos financeiros.' });
    }
  }

  async listarUm(req, res) {
    try {
      const { id } = req.params;
      const movimento = await Movimento.findByPk(id);

      res.status(200).json(movimento);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ erro: 'Não foi possível listar o movimento.' });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const movimento = await Movimento.findByPk(id);

      await movimento.update(req.body);
      await movimento.save();
      res.status(200).json({ mensagem: 'Alteração efetuada com sucesso!' });
    } catch (error) {
      res.status(500).json({ erro: 'Não foi possível atualizar o movimento.' });
    }
  }

  async excluir(req, res) {
    try {
      const { id } = req.params;
      const movimento = await Movimento.findByPk(id);

      await movimento.destroy();
      res.status(200).json({ mensagem: 'Movimento excluído com sucesso!' });
    } catch (error) {
      res.status(500).json({ erro: 'Não foi possível excluir o movimento.' });
    }
  }
}

module.exports = new MovimentoController();
