const UsuarioController = require('../../src/controllers/UsuarioController');
const Usuario = require('../../src/models/Usuario');

describe('UsuarioController', () => {
  beforeEach(async () => {
    // Limpa o banco antes de cada teste para evitar interferências
    await Usuario.destroy({ where: {} });
  });

  afterAll(async () => {
    // Fecha conexão com o banco após os testes
    await Usuario.sequelize.close();
  });

  describe('Cadastrar usuário', () => {
    it('deve cadastrar um novo usuário', async () => {
      const req = {
        body: {
          nome: 'Teste',
          email: 'teste@example.com',
          senha: 'senha123',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UsuarioController.cadastrar(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: 'Teste',
          email: 'teste@example.com',
        })
      );
    });
  });

  describe('Listar usuários', () => {
    beforeEach(async () => {
      await Usuario.create({
        nome: 'Usuário Teste',
        email: 'teste@example.com',
        senha: 'senha123',
      });
    });

    it('deve listar todos os usuários', async () => {
      const req = {}; // Nenhum parâmetro necessário para listagem
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UsuarioController.listar(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            nome: 'Usuário Teste',
            email: 'teste@example.com',
          }),
        ])
      );
    });
  });

  describe('Listar um usuário específico', () => {
    let usuarioCriado;

    beforeEach(async () => {
      usuarioCriado = await Usuario.create({
        nome: 'Usuário Teste',
        email: 'teste@example.com',
        senha: 'senha123',
      });
    });

    it('deve lista um usuário específico', async () => {
      const req = { params: { id: usuarioCriado.id } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UsuarioController.listarUm(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: usuarioCriado.id,
          nome: 'Usuário Teste',
          email: 'teste@example.com',
        })
      );
    });
  });

  describe('Atualizar usuário', () => {
    let usuarioCriado;

    beforeEach(async () => {
      usuarioCriado = await Usuario.create({
        nome: 'Usuário Teste',
        email: 'teste@example.com',
        senha: 'senha123',
      });
    });

    it('deve atualizar um usuário específico', async () => {
      const req = {
        params: { id: usuarioCriado.id },
        body: {
          nome: 'Novo Nome',
          email: 'novoteste@example.com',
          senha: 'novaSenha123',
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UsuarioController.atualizar(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ mensagem: 'Alteração efetuada com sucesso!' })
      );

      const usuarioAtualizado = await Usuario.findByPk(usuarioCriado.id);
      expect(usuarioAtualizado.nome).toBe('Novo Nome');
      expect(usuarioAtualizado.email).toBe('novoteste@example.com');
    });
  });

  describe('Excluir usuário', () => {
    let usuarioCriado;

    beforeEach(async () => {
      usuarioCriado = await Usuario.create({
        nome: 'Usuário Teste',
        email: 'teste@example.com',
        senha: 'senha123',
      });
    });

    it('deve excluir um usuário específico', async () => {
      const req = { params: { id: usuarioCriado.id } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await UsuarioController.excluir(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ mensagem: 'Usuário excluído com sucesso!' })
      );

      const usuarioDeletado = await Usuario.findByPk(usuarioCriado.id);
      expect(usuarioDeletado).toBeNull();
    });
  });
});
