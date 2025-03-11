const request = require("supertest");
const { Server } = require("../../src/server");
const { connection } = require("../../src/database/connection");
const jwt = require("jsonwebtoken");
const serverInstance = new Server();
const Usuario = require("../../src/models/Usuario");
const TipoMov = require("../../src/models/TipoMov");
const Movimento = require("../../src/models/Movimento");
const Conta = require("../../src/models/Conta");

describe("Testes de Integração - ClasseController", () => {
  let app;
  let token;
  let usuarioCriado;
  let classeCriada;
  let tipoMovCriado;
  let contaCriada;

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

    tipoMovCriado = await TipoMov.create({
      nome_tipo_mov: "Tipo Mov teste",
      usuario_id: usuarioCriado.id,
    });

    const response = await request(app)
      .post("/classe")
      .set("Authorization", token)
      .send({
        nome_classe: "Classe Teste",
        tipo_mov_id: tipoMovCriado.id,
        usuario_id: usuarioCriado.id,
      });

    classeCriada = response.body;
  });

  afterAll(async () => {
    await connection.close(); // Fecha a conexão após os testes
  });

  // ✅ Teste de cadastro
  describe("POST /classe", () => {
    it("deve cadastrar uma nova classe", async () => {
      const response = await request(app)
        .post("/classe")
        .set("Authorization", token)
        .send({
          nome_classe: "classe Teste Novo",
          tipo_mov_id: tipoMovCriado.id,
          usuario_id: usuarioCriado.id,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("nome_classe", "classe Teste Novo");
      expect(response.body).toHaveProperty("usuario_id", usuarioCriado.id);
    });

    it("deve retornar erro ao cadastrar classe duplicado", async () => {
      const response = await request(app)
        .post("/classe")
        .set("Authorization", token)
        .send({
          nome_classe: "Classe Teste",
          tipo_mov_id: tipoMovCriado.id,
          usuario_id: usuarioCriado.id,
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty("mensagem", "Classe já cadastrada!");
    });
  });

  // ✅ Teste de listar todos
  describe("GET /classe", () => {
    it("deve listar todas as classes", async () => {
      const response = await request(app)
        .get("/classe")
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            nome_classe: "Classe Teste",
            tipo_mov_id: tipoMovCriado.id,
            usuario_id: usuarioCriado.id,
          }),
        ])
      );
    });
  });

  // ✅ Teste de listar um
  describe("GET /classe/:id", () => {
    it("deve listar uma classe pelo ID", async () => {
      const response = await request(app)
        .get(`/classe/${classeCriada.id}`)
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", classeCriada.id);
      expect(response.body).toHaveProperty(
        "nome_classe",
        classeCriada.nome_classe
      );
      expect(response.body).toHaveProperty(
        "tipo_mov_id",
        classeCriada.tipo_mov_id
      );
      expect(response.body).toHaveProperty(
        "usuario_id",
        classeCriada.usuario_id
      );
    });

    it("deve retornar erro se a classe não for encontrada", async () => {
      const response = await request(app)
        .get("/classe/999")
        .set("Authorization", token);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "mensagem",
        "Classe não encontrada!"
      );
    });
  });

  // ✅ Teste de atualização
  describe("PUT /classe/:id", () => {
    it("deve atualizar uma classe específica", async () => {
      const response = await request(app)
        .put(`/classe/${classeCriada.id}`)
        .set("Authorization", token)
        .send({
          nome_classe: "Nome Atualizado",
          tipo_mov_id: tipoMovCriado.id,
          usuario_id: usuarioCriado.id,
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "mensagem",
        "Alteração efetuada com sucesso!"
      );
    });

    it("deve retornar erro ao tentar atualizar uma classe inexistente", async () => {
      const response = await request(app)
        .put("/classe/999")
        .set("Authorization", token)
        .send({
          nome_classe: "Novo Nome",
          tipo_mov_id: tipoMovCriado.id,
          usuario_id: usuarioCriado.id,
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "mensagem",
        "Classe não encontrada!"
      );
    });
  });

  // ✅ Teste de exclusão
  describe("DELETE /classe/:id", () => {
    it("deve excluir uma classe específica", async () => {
      const response = await request(app)
        .delete(`/classe/${classeCriada.id}`)
        .set("Authorization", token);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "mensagem",
        "Classe excluída com sucesso!"
      );

      // Verifica se foi realmente excluído
      const verificaClasse = await request(app)
        .get(`/classe/${classeCriada.id}`)
        .set("Authorization", token);
      expect(verificaClasse.status).toBe(404);
    });

    it("deve retornar erro ao tentar excluir uma classe inexistente", async () => {
      const response = await request(app)
        .delete("/classe/999")
        .set("Authorization", token);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        "mensagem",
        "Classe não encontrada!"
      );
    });

    it("deve impedir exclusão de classe vinculada a um movimento", async () => {
      contaCriada = await Conta.create({
        nome_conta: "Conta Teste",
        usuario_id: usuarioCriado.id,
      });

      await Movimento.create({
        data: "05/01/2025",
        vencimento: "05/01/2025",
        data_pagamento: null,
        classe_id: classeCriada.id,
        usuario_id: usuarioCriado.id,
        descricao: "Movimento Teste",
        valor: 100.0,
        conta_id: contaCriada.id,
      });

      // Tenta excluir a classe vinculada ao movimento
      const response = await request(app)
        .delete(`/classe/${classeCriada.id}`)
        .set("Authorization", token);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "erro",
        "Esta classe está vinculada a um movimento e não pode ser excluída."
      );
    });
  });
});
