const ContaController = require("../../src/controllers/ContaController");
const Conta = require("../../src/models/Conta");
const Usuario = require("../../src/models/Usuario");

describe("Erros no ContaController", () => {
  beforeAll(async () => {
    await Usuario.create({
      id: 2,
      nome: "Usuário Teste",
      email: "teste@email.com",
      senha: "12345",
    });
  });

  beforeEach(async () => {
    jest.restoreAllMocks(); // Restaura todos os mocks antes de cada teste
    await Conta.destroy({ where: {} }); // Limpa o banco antes de cada teste
  });

  afterAll(async () => {
    await Conta.sequelize.close(); // Fecha conexão com o banco após os testes
  });

  it("deve retornar 400 ao tentar cadastrar sem nome", async () => {
    const req = {
      body: {
        nome_conta: "",
        usuario_id: 2,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await ContaController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) })
    );
  });

  it("deve retornar 409 ao tentar cadastrar com descricao já existente", async () => {
    await Conta.create({
      nome_conta: "Teste",
      usuario_id: 2,
    });

    const req = {
      body: {
        nome_conta: "Teste",
        usuario_id: 2,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await ContaController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensagem: "Conta já cadastrada!" })
    );
  });

  it("deve retornar 500 ao ocorrer um erro interno no cadastro", async () => {
    jest.spyOn(Conta, "create").mockRejectedValue(new Error("Erro interno"));

    const req = {
      body: {
        nome_conta: "Teste",
        usuario_id: 2,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await ContaController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        erro: "Não foi possível cadastrar a conta.",
      })
    );
  });

  it("deve retornar 404 ao tentar listar uma conta inexistente", async () => {
    const req = { params: { id: 9999 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(Conta, "findByPk").mockResolvedValue(null);

    await ContaController.listarUm(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensagem: "Conta não encontrada!" })
    );
  });

  it("deve retornar 500 ao ocorrer um erro interno na busca de uma conta", async () => {
    jest.spyOn(Conta, "findByPk").mockRejectedValue(new Error("Erro interno"));

    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await ContaController.listarUm(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        erro: "Não foi possível listar a conta.",
      })
    );
  });

  it("deve retornar 404 ao tentar excluir uma conta inexistente", async () => {
    const req = { params: { id: 9999 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(Conta, "findByPk").mockResolvedValue(null);

    await ContaController.excluir(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensagem: "Conta não encontrada!" })
    );
  });

  it("deve retornar 500 ao ocorrer um erro interno na exclusão", async () => {
    jest.spyOn(Conta, "findByPk").mockResolvedValue({
      destroy: jest.fn().mockRejectedValue(new Error("Erro interno")),
    });

    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await ContaController.excluir(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        erro: "Não foi possível excluir a conta.",
      })
    );
  });
});
