const { Op, fn, col } = require("sequelize");
const Movimento = require("../models/Movimento");

const RelatorioController = async (req, res) => {
  try {
    const {
      classe_id,
      data_inicial,
      data_final,
      vencimento_inicial,
      vencimento_final,
      pagamento_inicial,
      pagamento_final,
      descricao,
    } = req.query;

    let filtros = {};

    if (classe_id) {
      filtros.classe_id = classe_id;
    }

    if (data_inicial && data_final) {
      filtros.data = {
        [Op.between]: [data_inicial, data_final],
      };
    }

    if (vencimento_inicial && vencimento_final) {
      filtros.vencimento = {
        [Op.between]: [vencimento_inicial, vencimento_final],
      };
    }

    if (pagamento_inicial && pagamento_final) {
      filtros.pagamento = {
        [Op.between]: [pagamento_inicial, pagamento_final],
      };
    }

    if (descricao) {
      filtros.descricao = { [Op.iLike]: `%${descricao}%` }; // Busca parcial (case insensitive)
    }

    const movimentos = await Movimento.findAll({
      where: filtros,
      attributes: ["classe_id", [fn("SUM", col("valor")), "total"]],
      group: ["classe_id"], // Agrupando por classe_id
    });

    return res.status(200).json(movimentos);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Erro ao obter relatório",
      error: error.message,
    });
  }
};

module.exports = {
  RelatorioController,
};
