const ContaController = require('../../src/controllers/ContaController');
const Conta = require('../../src/models/Conta');
const Usuario = require('../../src/models/Usuario');

describe('ContaController', () => {
  beforeAll(async () => {
    await Usuario.create({
      id: 2,
      nome: 'Usuário Teste',
      email: 'teste@email.com',
      senha: '12345',
    });
  });

  beforeEach(async () => {
    // Limpa o banco antes de cada teste para evitar interferências
    await Conta.destroy({ where: {} });
  });

  afterAll(async () => {
    // Fecha conexão com o banco após os testes
    await Conta.sequelize.close();
  });

  describe('Cadastrar conta', () => {
    it('deve cadastrar uma novo conta', async () => {
      const req = {
        body: {
          nome_conta: 'Teste',
          usuario_id: 2,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ContaController.cadastrar(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          nome_conta: 'Teste',
          usuario_id: 2,
        })
      );
    });
  });

  describe('Listar contas', () => {
    beforeEach(async () => {
      await Conta.create({
        nome_conta: 'Conta Teste',
        usuario_id: 2,
      });
    });

    it('deve listar todas as contas', async () => {
      const req = {}; // Nenhum parâmetro necessário para listagem
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ContaController.listar(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            nome_conta: 'Conta Teste',
            usuario_id: 2,
          }),
        ])
      );
    });
  });

  describe('Listar uma conta específica', () => {
    let contaCriada;

    beforeEach(async () => {
      contaCriada = await Conta.create({
        nome_conta: 'Conta Teste',
        usuario_id: 2,
      });
    });

    it('deve listar uma conta específica', async () => {
      const req = { params: { id: contaCriada.id } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ContaController.listarUm(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: contaCriada.id,
          nome_conta: 'Conta Teste',
          usuario_id: 2,
        })
      );
    });
  });

  describe('Atualizar conta', () => {
    let contaCriada;

    beforeEach(async () => {
      contaCriada = await Conta.create({
        nome_conta: 'Conta Teste',
        usuario_id: 2,
      });
    });

    it('deve atualizar uma conta específica', async () => {
      const req = {
        params: { id: contaCriada.id },
        body: {
          nome_conta: 'Nova Conta',
          usuario_id: 2,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ContaController.atualizar(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ mensagem: 'Alteração efetuada com sucesso!' })
      );

      const contaAtualizada = await Conta.findByPk(contaCriada.id);
      expect(contaAtualizada.nome_conta).toBe('Nova Conta');
    });
  });

  describe('Excluir conta', () => {
    let contaCriada;

    beforeEach(async () => {
      contaCriada = await Conta.create({
        nome_conta: 'Conta Teste',
        usuario_id: 2,
      });
    });

    it('deve excluir uma conta específica', async () => {
      const req = { params: { id: contaCriada.id } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ContaController.excluir(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          mensagem: 'Conta excluída com sucesso!',
        })
      );

      const contaDeletada = await Conta.findByPk(contaCriada.id);
      expect(contaDeletada).toBeNull();
    });
  });
});
