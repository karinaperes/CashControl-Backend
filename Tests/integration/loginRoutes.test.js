const request = require('supertest');
const { Server } = require('../../src/server');
const { connection } = require('../../src/database/connection');
const Usuario = require('../../src/models/Usuario');

const serverInstance = new Server();

describe('Testes de Integração - LoginController', () => {
  let app;
  let usuarioCriado;
  let senhaUsuario = 'senha123';

  beforeAll(() => {
    app = serverInstance.getApp();
  });

  beforeEach(async () => {
    await connection.sync({ force: true });
    
    usuarioCriado = await Usuario.create({
      nome: 'Usuário Teste',
      email: 'teste@email.com',
      senha: senhaUsuario, // Assumindo que a senha já foi armazenada com hash
    });
  });

  afterAll(async () => {
    await connection.close();
  });

  describe('POST /login', () => {
    it('deve autenticar um usuário com credenciais válidas e retornar um token', async () => {
      const response = await request(app).post('/login').send({
        email: 'teste@email.com',
        senha: senhaUsuario,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('Token');
    });

    it('deve retornar erro ao tentar autenticar com senha incorreta', async () => {
      const response = await request(app).post('/login').send({
        email: 'teste@email.com',
        senha: 'senhaErrada',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('mensagem', 'Senha inválida');
    });

    it('deve retornar erro ao tentar autenticar com email inexistente', async () => {
      const response = await request(app).post('/login').send({
        email: 'naoexiste@email.com',
        senha: 'senha123',
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('erro', 'Email não corresponde a nenhum usuário');
    });

    it('deve retornar erro se o email estiver vazio ou apenas com espaços', async () => {
      const response = await request(app).post('/login').send({
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
      const response = await request(app).post('/login').send({
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
  });
});
