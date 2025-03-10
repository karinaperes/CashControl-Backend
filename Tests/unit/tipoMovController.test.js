const TipoMovController = require('../../src/controllers/TipoMovController');
const TipoMov = require('../../src/models/TipoMov');
const Usuario = require('../../src/models/Usuario');

describe('TipoMovController', () => {
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
    await TipoMov.destroy({ where: {} });
  });

  afterAll(async () => {
    // Fecha conexão com o banco após os testes
    await TipoMov.sequelize.close();
  });

  describe('Cadastrar tipo de movimento', () => {
    it('deve cadastrar um novo tipo de movimento', async () => {
      const req = {
        body: {
          nome_tipo_mov: 'Teste',
          usuario_id: 2,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await TipoMovController.cadastrar(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          nome_tipo_mov: 'Teste',
          usuario_id: 2,
        })
      );
    });
  });

  describe('Listar tipos de movimentos', () => {
    beforeEach(async () => {
      await TipoMov.create({
        nome_tipo_mov: 'Tipo de movimento Teste',
        usuario_id: 2,
      });
    });

    it('deve listar todos os tipos de movimentos', async () => {
      const req = {}; // Nenhum parâmetro necessário para listagem
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await TipoMovController.listar(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            nome_tipo_mov: 'Tipo de movimento Teste',
            usuario_id: 2,
          }),
        ])
      );
    });
  });

  describe('Listar um tipo de movimento específico', () => {
    let tipoMovCriado;

    beforeEach(async () => {
      tipoMovCriado = await TipoMov.create({
        nome_tipo_mov: 'Tipo de movimento Teste',
        usuario_id: 2,
      });
    });

    it('deve listar um tipo de movimento específico', async () => {
      const req = { params: { id: tipoMovCriado.id } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await TipoMovController.listarUm(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: tipoMovCriado.id,
          nome_tipo_mov: 'Tipo de movimento Teste',
          usuario_id: 2,
        })
      );
    });
  });

  describe('Atualizar tipo de movimento', () => {
    let tipoMovCriado;

    beforeEach(async () => {
      tipoMovCriado = await TipoMov.create({
        nome_tipo_mov: 'Tipo de movimento Teste',
        usuario_id: 2,
      });
    });

    it('deve atualizar um tipo de movimento específico', async () => {
      const req = {
        params: { id: tipoMovCriado.id },
        body: {
          nome_tipo_mov: 'Novo tipo Mov',
          usuario_id: 2,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await TipoMovController.atualizar(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ mensagem: 'Alteração efetuada com sucesso!' })
      );

      const tipoMovAtualizado = await TipoMov.findByPk(tipoMovCriado.id);
      expect(tipoMovAtualizado.nome_tipo_mov).toBe('Novo tipo Mov');
    });
  });

  describe('Excluir tipo de movimento', () => {
    let tipoMovCriado;

    beforeEach(async () => {
      tipoMovCriado = await TipoMov.create({
        nome_tipo_mov: 'Tipo de movimento Teste',
        usuario_id: 2,
      });
    });

    it('deve excluir um tipo de movimento específico', async () => {
      const req = { params: { id: tipoMovCriado.id } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await TipoMovController.excluir(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          mensagem: 'Tipo de movimento excluído com sucesso!',
        })
      );

      const tipoMovDeletado = await TipoMov.findByPk(tipoMovCriado.id);
      expect(tipoMovDeletado).toBeNull();
    });
  });
});
