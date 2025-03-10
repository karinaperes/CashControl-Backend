const TipoMovController = require("../../src/controllers/TipoMovController");
const TipoMov = require("../../src/models/TipoMov");
const Usuario = require("../../src/models/Usuario");

describe("Erros no TipoMovController", () => {
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
    await TipoMov.destroy({ where: {} }); // Limpa o banco antes de cada teste
  });

  afterAll(async () => {
    await TipoMov.sequelize.close(); // Fecha conexão com o banco após os testes
  });

  it("deve retornar 400 ao tentar cadastrar sem nome", async () => {
    const req = {
      body: {
        nome_tipo_mov: "",
        usuario_id: 2,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await TipoMovController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) })
    );
  });

  it("deve retornar 409 ao tentar cadastrar com descricao já existente", async () => {
    await TipoMov.create({
      nome_tipo_mov: "Teste",
      usuario_id: 2,
    });

    const req = {
      body: {
        nome_tipo_mov: "Teste",
        usuario_id: 2,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await TipoMovController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensagem: "Tipo de movimento já cadastrado!" })
    );
  });

  it("deve retornar 500 ao ocorrer um erro interno no cadastro", async () => {
    jest.spyOn(TipoMov, "create").mockRejectedValue(new Error("Erro interno"));

    const req = {
      body: {
        nome_tipo_mov: "Teste",
        usuario_id: 2,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await TipoMovController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        erro: "Não foi possível efetuar o cadastro do tipo de movimento.",
      })
    );
  });

  it("deve retornar 404 ao tentar listar um tipoMov inexistente", async () => {
    const req = { params: { id: 9999 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(TipoMov, "findByPk").mockResolvedValue(null);

    await TipoMovController.listarUm(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensagem: "Tipo de movimento não encontrado!" })
    );
  });

  it("deve retornar 500 ao ocorrer um erro interno na busca de um tipoMov", async () => {
    jest
      .spyOn(TipoMov, "findByPk")
      .mockRejectedValue(new Error("Erro interno"));

    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await TipoMovController.listarUm(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        erro: "Não foi possível listar o tipo de movimento.",
      })
    );
  });

  it("deve retornar 404 ao tentar excluir um tipoMov inexistente", async () => {
    const req = { params: { id: 9999 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(TipoMov, "findByPk").mockResolvedValue(null);

    await TipoMovController.excluir(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensagem: "Tipo de movimento não encontrado!" })
    );
  });

  it("deve retornar 500 ao ocorrer um erro interno na exclusão", async () => {
    jest.spyOn(TipoMov, "findByPk").mockResolvedValue({
      destroy: jest.fn().mockRejectedValue(new Error("Erro interno")),
    });

    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await TipoMovController.excluir(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        erro: "Não foi possível excluir o tipo de movimento.",
      })
    );
  });
});
