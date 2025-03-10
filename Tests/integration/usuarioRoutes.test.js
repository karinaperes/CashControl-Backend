const request = require('supertest');
const { Server } = require('../../src/server'); // Importa a classe Server
const { connection } = require('../../src/database/connection'); // Conexão com o banco

const serverInstance = new Server(); // Instancia a classe Server

describe('Testes de Integração - UsuarioController', () => {
  let app;
  let usuarioCriado;

  beforeAll(() => {
    app = serverInstance.getApp(); // Obtenha o app (servidor Express)
  });

  beforeEach(async () => {
    await connection.sync({ force: true }); // Limpa o banco antes de cada teste

    // Cria um usuário para os testes
    const response = await request(app).post('/usuario').send({
      nome: 'Usuário Teste',
      email: 'teste@example.com',
      senha: 'senha123',
    });

    usuarioCriado = response.body;
  });

  afterAll(async () => {
    await connection.close(); // Fecha a conexão após os testes
  });

  // ✅ Teste de cadastro de usuário
  describe('POST /usuario', () => {
    it('deve cadastrar um novo usuário', async () => {
      const response = await request(app).post('/usuario').send({
        nome: 'Teste',
        email: 'novoemail@example.com',
        senha: 'senha123',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('nome', 'Teste');
      expect(response.body).toHaveProperty('email', 'novoemail@example.com');
    });

    it('deve retornar erro ao cadastrar usuário com email duplicado', async () => {
      const response = await request(app).post('/usuario').send({
        nome: 'Teste',
        email: 'teste@example.com',
        senha: 'senha123',
      });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('mensagem', 'E-mail já cadastrado!');
    });
  });

  // ✅ Teste de listar todos os usuários
  describe('GET /usuario', () => {
    it('deve listar todos os usuários', async () => {
      const response = await request(app).get('/usuario');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            nome: 'Usuário Teste',
            email: 'teste@example.com',
          }),
        ])
      );
    });
  });

  // ✅ Teste de listar um usuário específico
  describe('GET /usuario/:id', () => {
    it('deve listar um usuário pelo ID', async () => {
      const response = await request(app).get(`/usuario/${usuarioCriado.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', usuarioCriado.id);
      expect(response.body).toHaveProperty('nome', 'Usuário Teste');
    });

    it('deve retornar erro se o usuário não for encontrado', async () => {
      const response = await request(app).get('/usuario/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'mensagem',
        'Usuário não encontrado!'
      );
    });
  });

  // ✅ Teste de atualização de usuário
  describe('PUT /usuario/:id', () => {
    it('deve atualizar um usuário específico', async () => {
      const response = await request(app)
        .put(`/usuario/${usuarioCriado.id}`)
        .send({
          nome: 'Nome Atualizado',
          email: 'atualizado@example.com',
          senha: 'novaSenha123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'mensagem',
        'Alteração efetuada com sucesso!'
      );
    });

    it('deve retornar erro ao tentar atualizar um usuário inexistente', async () => {
      const response = await request(app).put('/usuario/999').send({
        nome: 'Novo Nome',
        email: 'novoemail@example.com',
        senha: 'senha123',
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'mensagem',
        'Usuário não encontrado!'
      );
    });
  });

  // ✅ Teste de exclusão de usuário
  describe('DELETE /usuario/:id', () => {
    it('deve excluir um usuário específico', async () => {
      const response = await request(app).delete(
        `/usuario/${usuarioCriado.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'mensagem',
        'Usuário excluído com sucesso!'
      );

      // Verifica se o usuário foi realmente excluído
      const verificaUsuario = await request(app).get(
        `/usuario/${usuarioCriado.id}`
      );
      expect(verificaUsuario.status).toBe(404);
    });

    it('deve retornar erro ao tentar excluir um usuário inexistente', async () => {
      const response = await request(app).delete('/usuario/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'mensagem',
        'Usuário não encontrado!'
      );
    });
  });
});
