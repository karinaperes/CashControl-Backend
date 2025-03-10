const { Server } = require("../../src/server");
const { connection } = require("../../src/database/connection");
const request = require("supertest");
const LoginController = require("../../src/controllers/LoginController");
const Usuario = require("../../src/models/Usuario");

describe("Testes de Erros LoginController", () => {
  // let app;

  let usuario;

  beforeAll(async () => {
    await Usuario.create({
      id: 2,
      nome: "Usuário Teste",
      email: "teste@email.com",
      senha: "12345",
    });
  });

  beforeEach(async () => {
    // await connection.sync({ force: true });
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await connection.close();
  });

  //  describe('Método logar()', () => {
  //   it('deve retornar erro se o email estiver vazio ou apenas com espaços', async () => {
  //     const response = await request(app)
  //       .post('/login')
  //       .send({ email: '  ', senha: 'senha123' });

  //       expect(response.status).toHaveBeenCalledWith(400);
  //       expect(response.json).toHaveBeenCalledWith(
  //         expect.objectContaining({ errors: expect.any(Array) })
  //       );
  //   });

  it("deve retornar erro se a senha estiver vazia ou apenas com espaços", async () => {
    const req = {
      body: {
        email: "teste@email.com",
        senha: "   ",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await LoginController.logar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) })
    );
  });

  it("deve retornar erro se os dados de login não forem enviados", async () => {
    const response = await request(app).post("/login").send({});

    expect(response.status).toBe(400);
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ mensagem: "Email inválido" }),
        expect.objectContaining({ mensagem: "Senha inválida" }),
      ])
    );
  });
});
