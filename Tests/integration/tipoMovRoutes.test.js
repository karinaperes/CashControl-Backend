const request = require('supertest');
const { Server } = require('../../src/server');
const { connection } = require('../../src/database/connection');
const jwt = require('jsonwebtoken');
const serverInstance = new Server();
const Usuario = require('../../src/models/Usuario');

describe('Testes de Integração - TipoMovController', () => {
  let app;
  let tipoMovCriado;
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
    console.log('Usuário criado:', usuarioCriado);
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
    const response = await request(app)
      .post('/tipomov')
      .set('Authorization', token) // Inclui o token no cabeçalho Authorization
      .send({
        nome_tipo_mov: 'Tipo de Movimento Teste',
        usuario_id: usuarioCriado.id,
      });

    tipoMovCriado = response.body;
  });

  afterAll(async () => {
    await connection.close(); // Fecha a conexão após os testes
  });

  // ✅ Teste de cadastro
  describe('POST /tipomov', () => {
    it('deve cadastrar um novo tipo de movimento', async () => {
      const response = await request(app)
        .post('/tipomov')
        .set('Authorization', token)
        .send({
          nome_tipo_mov: 'Tipo de Movimento Teste Novo',
          usuario_id: usuarioCriado.id,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        'nome_tipo_mov',
        'Tipo de Movimento Teste Novo'
      );
      expect(response.body).toHaveProperty('usuario_id', usuarioCriado.id);
    });

    it('deve retornar erro ao cadastrar tipo de movimento duplicado', async () => {
      const response = await request(app)
        .post('/tipomov')
        .set('Authorization', token)
        .send({
          nome_tipo_mov: 'Tipo de Movimento Teste',
          usuario_id: usuarioCriado.id,
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty(
        'mensagem',
        'Tipo de movimento já cadastrado!'
      );
    });
  });

  // ✅ Teste de listar todos
  describe('GET /tipomov', () => {
    it('deve listar todos os tipos de movimento', async () => {
      const response = await request(app)
        .get('/tipomov')
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            nome_tipo_mov: 'Tipo de Movimento Teste',
            usuario_id: usuarioCriado.id,
          }),
        ])
      );
    });
  });

  // ✅ Teste de listar um
  describe('GET /tipomov/:id', () => {
    it('deve listar um tipo de movimento pelo ID', async () => {
      const response = await request(app)
        .get(`/tipomov/${tipoMovCriado.id}`)
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', tipoMovCriado.id);
      expect(response.body).toHaveProperty(
        'nome_tipo_mov',
        'Tipo de Movimento Teste'
      );
    });

    it('deve retornar erro se o tipo de movimento não for encontrado', async () => {
      const response = await request(app)
        .get('/tipomov/999')
        .set('Authorization', token);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'mensagem',
        'Tipo de movimento não encontrado!'
      );
    });
  });

  // ✅ Teste de atualização
  describe('PUT /tipomov/:id', () => {
    it('deve atualizar um tipo de movimento específico', async () => {
      const response = await request(app)
        .put(`/tipomov/${tipoMovCriado.id}`)
        .set('Authorization', token)
        .send({
          nome_tipo_mov: 'Nome Atualizado',
          usuario_id: usuarioCriado.id,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'mensagem',
        'Alteração efetuada com sucesso!'
      );
    });

    it('deve retornar erro ao tentar atualizar um tipo de movimento inexistente', async () => {
      const response = await request(app)
        .put('/tipomov/999')
        .set('Authorization', token)
        .send({
          nome_tipo_mov: 'Novo Nome',
          usuario_id: usuarioCriado.id,
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'mensagem',
        'Tipo de movimento não encontrado!'
      );
    });
  });

  // ✅ Teste de exclusão
  describe('DELETE /tipomov/:id', () => {
    it('deve excluir um tipo de movimento específico', async () => {
      const response = await request(app)
        .delete(`/tipomov/${tipoMovCriado.id}`)
        .set('Authorization', token);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'mensagem',
        'Tipo de movimento excluído com sucesso!'
      );

      // Verifica se foi realmente excluído
      const verificaTipoMov = await request(app)
        .get(`/tipomov/${tipoMovCriado.id}`)
        .set('Authorization', token);
      expect(verificaTipoMov.status).toBe(404);
    });

    it('deve retornar erro ao tentar excluir um tipo de movimento inexistente', async () => {
      const response = await request(app)
        .delete('/tipomov/999')
        .set('Authorization', token);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'mensagem',
        'Tipo de movimento não encontrado!'
      );
    });
  });
});
