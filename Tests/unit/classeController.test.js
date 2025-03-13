const ClasseController = require("../../src/controllers/ClasseController");
const Classe = require("../../src/models/Classe");
const Usuario = require("../../src/models/Usuario");
const TipoMov = require("../../src/models/TipoMov");

describe("ClasseController", () => {
  let usuarioCriado;
  let tipoMovCriado;

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
  });

  beforeEach(async () => {
    await Classe.destroy({ where: {} });
  });

  afterAll(async () => {
    await Classe.sequelize.close();
  });

  describe("Cadastrar classe", () => {
    it("deve cadastrar uma nova classe", async () => {
      const req = {
        body: {
          nome_classe: "Classe Teste",
          tipo_mov_id: tipoMovCriado.id,
          usuario_id: usuarioCriado.id,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ClasseController.cadastrar(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          nome_classe: "Classe Teste",
          usuario_id: usuarioCriado.id,
        })
      );
    });
  });

  describe("Listar classes", () => {
    beforeEach(async () => {
      await Classe.create({
        nome_classe: "Classe Teste",
        tipo_mov_id: tipoMovCriado.id,
        usuario_id: usuarioCriado.id,
      });
    });

    it("deve listar todas as classes", async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ClasseController.listar(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            nome_classe: "Classe Teste",
            usuario_id: usuarioCriado.id,
          }),
        ])
      );
    });
  });

  describe("Listar uma classe específica", () => {
    let classeCriada;

    beforeEach(async () => {
      classeCriada = await Classe.create({
        nome_classe: "Classe Teste",
        tipo_mov_id: tipoMovCriado.id,
        usuario_id: usuarioCriado.id,
      });
    });

    it("deve listar uma classe específica", async () => {
      const req = { params: { id: classeCriada.id } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ClasseController.listarUm(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: classeCriada.id,
          nome_classe: "Classe Teste",
          usuario_id: usuarioCriado.id,
        })
      );
    });
  });

  describe("Atualizar classe", () => {
    let classeCriada;

    beforeEach(async () => {
      classeCriada = await Classe.create({
        nome_classe: "Classe Teste",
        tipo_mov_id: tipoMovCriado.id,
        usuario_id: usuarioCriado.id,
      });
    });

    it("deve atualizar uma classe específica", async () => {
      const req = {
        params: { id: classeCriada.id },
        body: {
          nome_classe: "Nova Classe",
          tipo_mov_id: tipoMovCriado.id,
          usuario_id: usuarioCriado.id,
        },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ClasseController.atualizar(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ mensagem: "Alteração efetuada com sucesso!" })
      );

      const classeAtualizada = await Classe.findByPk(classeCriada.id);
      expect(classeAtualizada.nome_classe).toBe("Nova Classe");
    });
  });

  describe("Excluir classe", () => {
    let classeCriada;

    beforeEach(async () => {
      classeCriada = await Classe.create({
        nome_classe: "Classe Teste",
        tipo_mov_id: tipoMovCriado.id,
        usuario_id: usuarioCriado.id,
      });
    });

    it("deve excluir uma classe específica", async () => {
      const req = { params: { id: classeCriada.id } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ClasseController.excluir(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          mensagem: "Classe excluída com sucesso!",
        })
      );

      const classeDeletada = await Classe.findByPk(classeCriada.id);
      expect(classeDeletada).toBeNull();
    });
  });
});
