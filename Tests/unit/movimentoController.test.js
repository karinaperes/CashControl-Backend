const MovimentoController = require("../../src/controllers/MovimentoController");
const Movimento = require("../../src/models/Movimento");
const Classe = require("../../src/models/Classe");
const Usuario = require("../../src/models/Usuario");
const TipoMov = require("../../src/models/TipoMov");
const Conta = require("../../src/models/Conta");

describe("MovimentoController", () => {
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

  describe("Cadastrar movimento", () => {
    it("deve cadastrar um novo movimento", async () => {
      const req = {
        body: {
          data: "2025-01-08",
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

      console.log(res.status.mock.calls);
      console.log(res.json.mock.calls);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: "2025-01-08",
          vencimento: "2025-01-08",
          data_pagamento: null,
          classe_id: classeCriada.id,
          usuario_id: usuarioCriado.id,
          descricao: "Movimento Teste",
          valor: "100.09",
          conta_id: contaCriada.id,
        })
      );
    });
  });

  describe("Listar movimentos", () => {
    beforeEach(async () => {
      await Movimento.create({
        data: "2025-01-08",
          vencimento: "2025-01-08",
          data_pagamento: null,
          classe_id: classeCriada.id,
          usuario_id: usuarioCriado.id,
          descricao: "Movimento Teste",
          valor: "100.09",
          conta_id: contaCriada.id,
      });
    });

    it("deve listar todas as movimentos", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await MovimentoController.listar(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            data: "2025-01-08",
          vencimento: "2025-01-08",
          data_pagamento: null,
          classe_id: classeCriada.id,
          usuario_id: usuarioCriado.id,
          descricao: "Movimento Teste",
          valor: "100.09",
          conta_id: contaCriada.id,
          }),
        ])
      );
    });
  });

  describe("Listar uma movimento específico", () => {
    let movimentoCriado;

    beforeEach(async () => {
      movimentoCriado = await Movimento.create({
        data: "2025-01-08",
          vencimento: "2025-01-08",
          data_pagamento: null,
          classe_id: classeCriada.id,
          usuario_id: usuarioCriado.id,
          descricao: "Movimento Teste",
          valor: "100.09",
          conta_id: contaCriada.id,
      });
    });

    it("deve listar uma movimento específico", async () => {
      const req = { params: { id: movimentoCriado.id } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await MovimentoController.listarUm(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          data: "2025-01-08",
          vencimento: "2025-01-08",
          data_pagamento: null,
          classe_id: classeCriada.id,
          usuario_id: usuarioCriado.id,
          descricao: "Movimento Teste",
          valor: "100.09",
          conta_id: contaCriada.id,
        })
      );
    });
  });

  describe("Atualizar movimento", () => {
    let movimentoCriado;

    beforeEach(async () => {
      movimentoCriado = await Movimento.create({
        data: "2025-01-08",
          vencimento: "2025-01-08",
          data_pagamento: null,
          classe_id: classeCriada.id,
          usuario_id: usuarioCriado.id,
          descricao: "Movimento Teste",
          valor: "100.09",
          conta_id: contaCriada.id,
      });
    });

    it("deve atualizar uma movimento específico", async () => {
      const req = {
        params: { id: movimentoCriado.id },
        body: {
          data: "2025-01-08",
          vencimento: "2025-01-08",
          data_pagamento: null,
          classe_id: classeCriada.id,
          tipo_mov_id: tipoMovCriado.id,
          usuario_id: usuarioCriado.id,
          descricao: "Movimento Teste Novo",
          valor: "100.09",
          conta_id: contaCriada.id,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await MovimentoController.atualizar(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ mensagem: "Alteração efetuada com sucesso!" })
      );

      const movimentoAtualizado = await Movimento.findByPk(movimentoCriado.id);
      expect(movimentoAtualizado.descricao).toBe("Movimento Teste Novo");
    });
  });

  describe("Excluir movimento", () => {
    let movimentoCriado;

    beforeEach(async () => {
      movimentoCriado = await Movimento.create({
        data: "2025-01-08",
          vencimento: "2025-01-08",
          data_pagamento: null,
          classe_id: classeCriada.id,
          usuario_id: usuarioCriado.id,
          descricao: "Movimento Teste",
          valor: "100.09",
          conta_id: contaCriada.id,
      });
    });

    it("deve excluir uma movimento específico", async () => {
      const req = { params: { id: movimentoCriado.id } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await MovimentoController.excluir(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          mensagem: "Movimento excluído com sucesso!",
        })
      );

      const movimentoDeletado = await Movimento.findByPk(movimentoCriado.id);
      expect(movimentoDeletado).toBeNull();
    });
  });
});
