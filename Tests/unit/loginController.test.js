const { Server } = require('../../src/server');
const { connection } = require('../../src/database/connection');
const Usuario = require('../../src/models/Usuario');
const jwt = require('jsonwebtoken');
const request = require('supertest');

describe('Testes de Unidade LoginController', () => {
  let app;
  let usuarioCriado;
  let senhaUsuario = 'senha123';

  beforeAll(() => {
    app = new Server().getApp();
  });

  beforeEach(async () => {
    // Sincroniza o banco de dados e cria um usuário para testar
    await connection.sync({ force: true });

    usuarioCriado = await Usuario.create({
      nome: 'Usuário Teste',
      email: 'teste@email.com',
      senha: senhaUsuario, // A senha será automaticamente hashada pelo beforeSave do modelo
    });
  });

  afterAll(async () => {
    // Fecha a conexão com o banco de dados
    await connection.close();
  });

  describe('Método logar()', () => {
    it('deve autenticar um usuário com credenciais válidas e retornar um token', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'teste@email.com',
          senha: senhaUsuario,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('Token');
      // Verificar se o token gerado é um JWT válido
      const decoded = jwt.verify(response.body.Token, process.env.SECRET_JWT);
      expect(decoded).toHaveProperty('sub', usuarioCriado.id);
    });

    it('deve retornar erro ao tentar autenticar com senha incorreta', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'teste@email.com',
          senha: 'senhaErrada',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('mensagem', 'Senha inválida');
    });

    it('deve retornar erro ao tentar autenticar com email inexistente', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'naoexiste@email.com',
          senha: 'senha123',
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('erro', 'Email não corresponde a nenhum usuário');
    });

    it('deve retornar erro se o email estiver vazio ou apenas com espaços', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: '  ',
          senha: 'senha123',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ msg: 'O email não pode conter apenas espaços em branco' })
        ])
      );
    });

    it('deve retornar erro se a senha estiver vazia ou apenas com espaços', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'teste@email.com',
          senha: '   ',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ msg: 'A senha não pode conter apenas espaços em branco' })
        ])
      );
    });

    it('deve retornar erro se os dados de login não forem enviados', async () => {
      const response = await request(app)
        .post('/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ msg: 'Email inválido' }),
          expect.objectContaining({ msg: 'A senha deve ter pelo menos 4 caracteres' }),
        ])
      );
    });
  });
});
