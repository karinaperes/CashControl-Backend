const MovimentoController = require("../../src/controllers/MovimentoController");
const Movimento = require("../../src/models/Movimento");
const Classe = require("../../src/models/Classe");
const Usuario = require("../../src/models/Usuario");
const TipoMov = require("../../src/models/TipoMov");
const Conta = require("../../src/models/Conta");

describe("Erros MovimentoController", () => {
  let usuarioCriado;
  let tipoMovCriado;
  let contaCriada;

  beforeAll(async () => {
    usuarioCriado = await Usuario.create({
      id: 2,
      nome: "Usuário Teste",
      email: "teste@email.com",
      senha: "12345",
    });

    tipoMovCriado = await TipoMov.create({
      nome_tipo_mov: "Tipo Mov Teste",
      usuario_id: usuarioCriado.id,
    });

    classeCriada = await Classe.create({
      nome_classe: "Classe Teste",
      usuario_id: usuarioCriado.id,
      tipo_mov_id: tipoMovCriado.id,
    });

    contaCriada = await Conta.create({
      nome_conta: "Conta Teste",
      usuario_id: usuarioCriado.id,
    });
  });

  beforeEach(async () => {
    await Movimento.destroy({ where: {} });
  });

  afterAll(async () => {
    await Movimento.sequelize.close();
  });

  it("deve retornar 400 ao tentar cadastrar um movimento sem data", async () => {
    const req = {
      body: {
        data: "",
        vencimento: "2025-01-08",
        data_pagamento: null,
        classe_id: classeCriada.id,
        usuario_id: usuarioCriado.id,
        descricao: "Movimento Teste",
        valor: "100.09",
        conta_id: contaCriada.id,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await MovimentoController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) })
    );
  });

  it("deve retornar 400 ao tentar cadastrar um movimento sem vencimento", async () => {
    const req = {
      body: {
        data: "2025-01-08",
        vencimento: "",
        data_pagamento: null,
        classe_id: classeCriada.id,
        usuario_id: usuarioCriado.id,
        descricao: "Movimento Teste",
        valor: "100.09",
        conta_id: contaCriada.id,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await MovimentoController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) })
    );
  });

  it("deve retornar 400 ao tentar cadastrar um movimento sem classe", async () => {
    const req = {
      body: {
        data: "2025-01-08",
        vencimento: "2025-01-08",
        data_pagamento: null,
        classe_id: "",
        usuario_id: usuarioCriado.id,
        descricao: "Movimento Teste",
        valor: "100.09",
        conta_id: contaCriada.id,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await MovimentoController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) })
    );
  });

  it("deve retornar 400 ao tentar cadastrar um movimento sem valor", async () => {
    const req = {
      body: {
        data: "2025-01-08",
        vencimento: "2025-01-08",
        data_pagamento: null,
        classe_id: classeCriada.id,
        usuario_id: usuarioCriado.id,
        descricao: "Movimento Teste",
        valor: "",
        conta_id: contaCriada.id,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await MovimentoController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) })
    );
  });

  it("deve retornar 409 ao tentar cadastrar movimento já existente", async () => {
    await Movimento.create({
      data: "2025-01-08",
      vencimento: "2025-01-08",
      data_pagamento: null,
      classe_id: classeCriada.id,
      usuario_id: usuarioCriado.id,
      descricao: "Movimento Teste",
      valor: "100.99",
      conta_id: contaCriada.id,
    });

    const req = {
      body: {
        data: "2025-01-08",
        vencimento: "2025-01-08",
        data_pagamento: null,
        classe_id: classeCriada.id,
        usuario_id: usuarioCriado.id,
        descricao: "Movimento Teste",
        valor: "100.99",
        conta_id: contaCriada.id,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await MovimentoController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensagem: "Movimento já cadastrado!" })
    );
  });

  it("deve retornar 500 ao ocorrer um erro interno no cadastro", async () => {
    jest
      .spyOn(Movimento, "create")
      .mockRejectedValue(new Error("Erro interno"));

    const req = {
      body: {
        data: "2025-01-08",
        vencimento: "2025-01-08",
        data_pagamento: null,
        classe_id: classeCriada.id,
        usuario_id: usuarioCriado.id,
        descricao: "Movimento Teste",
        valor: "100.99",
        conta_id: contaCriada.id,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await MovimentoController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        erro: "Não foi possível efetuar o cadastro.",
      })
    );
  });

  it("deve retornar 404 ao tentar listar um movimento inexistente", async () => {
    const req = { params: { id: 9999 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(Movimento, "findByPk").mockResolvedValue(null);

    await MovimentoController.listarUm(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensagem: "Movimento não encontrado!" })
    );
  });

  it("deve retornar 500 ao ocorrer um erro interno na busca de um movimento", async () => {
    jest
      .spyOn(Movimento, "findByPk")
      .mockRejectedValue(new Error("Erro interno"));

    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await MovimentoController.listarUm(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        erro: "Não foi possível listar o movimento.",
      })
    );
  });

  it("deve retornar 404 ao tentar excluir um movimento inexistente", async () => {
    const req = { params: { id: 9999 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(Movimento, "findByPk").mockResolvedValue(null);

    await MovimentoController.excluir(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensagem: "Movimento não encontrado!" })
    );
  });

  it("deve retornar 500 ao ocorrer um erro interno na exclusão", async () => {
    jest.spyOn(Movimento, "findByPk").mockResolvedValue({
      destroy: jest.fn().mockRejectedValue(new Error("Erro interno")),
    });

    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await MovimentoController.excluir(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        erro: "Não foi possível excluir o movimento.",
      })
    );
  });
});
