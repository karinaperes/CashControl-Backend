const { Op } = require("sequelize");

const {
  RelatorioController,
} = require("../../src/controllers/RelatorioController");
const Movimento = require("../../src/models/Movimento");

jest.mock("../../src/models/Movimento", () => ({
  findAll: jest.fn(),
}));

describe("RelatorioController", () => {
  let req, res;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("deve retornar movimentos filtrados por data e classe_id", async () => {
    req.query = {
      classe_id: "3",
      data_inicial: "2025-01-01",
      data_final: "2025-01-30",
    };
    Movimento.findAll.mockResolvedValue([{ classe_id: 3, total: 500 }]);

    await RelatorioController(req, res);

    expect(Movimento.findAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          classe_id: "3",
          data: expect.objectContaining({
            [Op.between]: ["2025-01-01", "2025-01-30"],
          }),
        }),
        attributes: expect.any(Array),
        group: ["classe_id"],
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ classe_id: 3, total: 500 }]);
  });

  it("deve retornar erro 500 quando houver falha", async () => {
    Movimento.findAll.mockRejectedValue(new Error("Erro de banco"));

    await RelatorioController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Erro ao obter relatório" })
    );
  });
});
