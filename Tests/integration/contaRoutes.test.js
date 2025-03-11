const request = require("supertest");
const { Server } = require("../../src/server");
const { connection } = require("../../src/database/connection");
const jwt = require("jsonwebtoken");
const serverInstance = new Server();
const Usuario = require("../../src/models/Usuario");
const Movimento = require("../../src/models/Movimento");
const Classe = require("../../src/models/Classe");
const TipoMov = require("../../src/models/TipoMov");

describe("Testes de Integração - ContaController", () => {
  let app;
  let contaCriada;
  let token;
  let usuarioCriado;
  let classeCriada;
  let tipoMovCriado;

  beforeAll(async () => {
    app = serverInstance.getApp(); // Obtenha o app (servidor Express)
    await connection.sync({ force: true }); // Limpa o banco e recria as tabelas
    usuarioCriado = await Usuario.create({
      nome: "Usuário Teste",
      email: "teste@email.com",
      senha: "12345",
    });
    console.log("Usuário criado:", usuarioCriado);
    token = jwt.sign(
      { id: usuarioCriado.id, nome: usuarioCriado.nome },
      process.env.SECRET_JWT,
      { expiresIn: "5h" }
    );
  });

  beforeEach(async () => {
    await connection.sync({ force: true }); // Limpa o banco antes de cada teste
    usuarioCriado = await Usuario.create({
      nome: "Usuário Teste",
      email: "teste@email.com",
      senha: "12345",
    });
    const response = await request(app)
      .post("/conta")
      .set("Authorization", token) // Inclui o token no cabeçalho Authorization
      .send({
        nome_conta: "Conta Teste",
        usuario_id: usuarioCriado.id,
      });

    contaCriada = response.body;
  });

  afterAll(async () => {
    await connection.close(); // Fecha a conexão após os testes
  });

  // ✅ Teste de cadastro
  describe("POST /conta", () => {
    it("deve cadastrar uma nova conta", async () => {
      const response = await request(app)
        .post("/conta")
        .set("Authorization", token)
        .send({
          nome_conta: "Conta Teste Novo",
          usuario_id: usuarioCriado.id,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("nome_conta", "Conta Teste Novo");
      expect(response.body).toHaveProperty("usuario_id", usuarioCriado.id);
    });

    it("deve retornar erro ao cadastrar Conta duplicado", async () => {
      const response = await request(app)
        .post("/conta")
        .set("Authorization", token)
        .send({
          nome_conta: "Conta Teste",
          usuario_id: usuarioCriado.id,
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("mensagem", "Conta já cadastrada!");
    });
  });

  // ✅ Teste de listar todos
  describe("GET /conta", () => {
    it("deve listar todas as contas", async () => {
      const response = await request(app)
        .get("/conta")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            nome_conta: "Conta Teste",
            usuario_id: usuarioCriado.id,
          }),
        ])
      );
    });
  });

  // ✅ Teste de listar um
  describe("GET /conta/:id", () => {
    it("deve listar uma conta pelo ID", async () => {
      const response = await request(app)
        .get(`/conta/${contaCriada.id}`)
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", contaCriada.id);
      expect(response.body).toHaveProperty("nome_conta", "Conta Teste");
    });

    it("deve retornar erro se a conta não for encontrada", async () => {
      const response = await request(app)
        .get("/conta/999")
        .set("Authorization", token);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("mensagem", "Conta não encontrada!");
    });
  });

  // ✅ Teste de atualização
  describe("PUT /conta/:id", () => {
    it("deve atualizar uma conta específica", async () => {
      const response = await request(app)
        .put(`/conta/${contaCriada.id}`)
        .set("Authorization", token)
        .send({
          nome_conta: "Nome Atualizado",
          usuario_id: usuarioCriado.id,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "mensagem",
        "Alteração efetuada com sucesso!"
      );
    });

    it("deve retornar erro ao tentar atualizar uma conta inexistente", async () => {
      const response = await request(app)
        .put("/conta/999")
        .set("Authorization", token)
        .send({
          nome_conta: "Novo Nome",
          usuario_id: usuarioCriado.id,
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("mensagem", "Conta não encontrada!");
    });
  });

  // ✅ Teste de exclusão
  describe("DELETE /conta/:id", () => {
    it("deve excluir uma conta específica", async () => {
      const response = await request(app)
        .delete(`/conta/${contaCriada.id}`)
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "mensagem",
        "Conta excluída com sucesso!"
      );

      // Verifica se foi realmente excluído
      const verificaTipoMov = await request(app)
        .get(`/conta/${contaCriada.id}`)
        .set("Authorization", token);
      expect(verificaTipoMov.status).toBe(404);
    });

    it("deve retornar erro ao tentar excluir uma conta inexistente", async () => {
      const response = await request(app)
        .delete("/conta/999")
        .set("Authorization", token);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("mensagem", "Conta não encontrada!");
    });

    it("deve impedir exclusão de conta vinculada a um movimento", async () => {
      tipoMovCriado = await TipoMov.create({
        nome_tipo_mov: "Tipo Mov teste",
        usuario_id: usuarioCriado.id,
      });

      classeCriada = await Classe.create({
        nome_classe: "Classe Teste",
        usuario_id: usuarioCriado.id,
        tipo_mov_id: tipoMovCriado.id,
      });

      await Movimento.create({
        data: "05/01/2025",
        vencimento: "05/01/2025",
        data_pagamento: null,
        classe_id: classeCriada.id,
        usuario_id: usuarioCriado.id,
        descricao: "Movimento Teste",
        valor: 100.0,
        conta_id: contaCriada.id, // Associa o movimento à conta criada
      });

      console.error("Este log sempre aparecerá!");

      console.log("IDs usados para criar Movimento:", {
        classe_id: classeCriada.id,
        usuario_id: usuarioCriado.id,
        conta_id: contaCriada.id,
      });

      // Tenta excluir a conta vinculada ao movimento
      const response = await request(app)
        .delete(`/conta/${contaCriada.id}`)
        .set("Authorization", token);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "erro",
        "Esta conta está vinculada a um movimento e não pode ser excluída."
      );
    });
  });
});
