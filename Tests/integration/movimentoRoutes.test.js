const request = require('supertest');
const { Server } = require('../../src/server');
const { connection } = require('../../src/database/connection');
const jwt = require('jsonwebtoken');
const serverInstance = new Server();
const Usuario = require('../../src/models/Usuario');

describe('Testes de Integração - MovimentoController', () => {
  let app;
  let movimentoCriado;
  let token;
  let usuarioCriado;

  beforeAll(async () => {
    app = serverInstance.getApp(); // Obtenha o app (servidor Express)
    await connection.sync({ force: true }); // Limpa o banco e recria as tabelas
    usuarioCriado = await Usuario.create({
      nome: 'Usuário Teste',
      email: 'teste@email.com',
      senha: '12345',
    });
    token = jwt.sign(
      { id: usuarioCriado.id, nome: usuarioCriado.nome },
      process.env.SECRET_JWT,
      { expiresIn: '5h' }
    );
  });

  beforeEach(async () => {
    await connection.sync({ force: true }); // Limpa o banco antes de cada teste
    usuarioCriado = await Usuario.create({
      nome: 'Usuário Teste',
      email: 'teste@email.com',
      senha: '12345',
    });
  });

  afterAll(async () => {
    await connection.close(); // Fecha a conexão após os testes
  });

  // ✅ Teste de cadastro
  describe('POST /movimento', () => {
    it('deve cadastrar um novo movimento', async () => {
      const response = await request(app)
        .post('/movimento')
        .set('Authorization', token)
        .send({
          descricao: 'Movimento Teste',
          usuario_id: usuarioCriado.id,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('descricao', 'Movimento Teste');
    });

    it('deve retornar erro ao cadastrar um movimento sem descrição', async () => {
      const response = await request(app)
        .post('/movimento')
        .set('Authorization', token)
        .send({ usuario_id: usuarioCriado.id });

      expect(response.status).toBe(400);
      expect(response.body.errors[0].msg).toBe('Insira uma data de competência válida');
    });
  });

  // ✅ Teste de listar todos
  describe('GET /movimento', () => {
    it('deve listar todos os movimentos', async () => {
      const response = await request(app)
        .get('/movimento')
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // ✅ Teste de listar um
  describe('GET /movimento/:id', () => {
    it('deve retornar erro se o movimento não for encontrado', async () => {
      const response = await request(app)
        .get('/movimento/999')
        .set('Authorization', token);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('mensagem', 'Movimento não encontrado!');
    });
  });

  // ✅ Teste de atualização
  describe('PUT /movimento/:id', () => {
    it('deve retornar erro ao tentar atualizar um movimento inexistente', async () => {
      const response = await request(app)
        .put('/movimento/999')
        .set('Authorization', token)
        .send({ descricao: 'Novo Nome' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('mensagem', 'Movimento não encontrado!');
    });
  });

  // ✅ Teste de exclusão
  describe('DELETE /movimento/:id', () => {
    it('deve retornar erro ao tentar excluir um movimento inexistente', async () => {
      const response = await request(app)
        .delete('/movimento/999')
        .set('Authorization', token);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('mensagem', 'Movimento não encontrado!');
    });
  });
});

