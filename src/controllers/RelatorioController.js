const { Op, fn, col } = require("sequelize");
const Movimento = require("../models/Movimento");
const Classe = require("../models/Classe");
const TipoMov = require("../models/TipoMov");

const listarMovimentos = async (req, res) => {
  try {
    const { data_inicial, data_final, descricao } = req.query;

    let filtros = {};

    if (data_inicial && data_final) {
      filtros.data = { [Op.between]: [data_inicial, data_final] };
    }

    if (descricao) {
      filtros.descricao = { [Op.iLike]: `%${descricao}%` };
    }

    const movimentos = await Movimento.findAll({
      where: filtros,
      include: [
        {
          model: Classe,
          as: "classe",
          attributes: ["nome_classe"],
          include: [
            {
              model: TipoMov,
              as: "tipoMov",
              attributes: ["nome_tipo_mov"], // Pegamos o tipo para diferenciar receitas de despesas
            },
          ],
        },
      ],
      order: [["data", "DESC"]],
    });

    return res.status(200).json(movimentos);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erro ao listar movimentos", error: error.message });
  }
};

const graficoReceitaDespesa = async (req, res) => {
  try {
    const { data_inicial, data_final } = req.query;

    let filtros = {};

    if (data_inicial && data_final) {
      filtros.data = { [Op.between]: [data_inicial, data_final] };
    }

    const totais = await Movimento.findAll({
      where: filtros,
      include: [
        {
          model: Classe,
          as: "classe",
          include: [
            {
              model: TipoMov,
              as: "tipoMov",
              attributes: ["tipo"],
            },
          ],
        },
      ],
      attributes: [
        [fn("SUM", col("valor")), "total"],
        [col("classe.tipoMov.nome_tipo_mov"), "tipo_mov"],
      ],
      group: ["classe.tipoMov.tipo"],
    });

    const resultado = totais.map((item) => ({
      tipo: item.dataValues.tipo_mov,
      total: parseFloat(item.dataValues.total),
    }));

    return res.status(200).json(resultado);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erro ao gerar gráfico", error: error.message });
  }
};

module.exports = {
  listarMovimentos,
  graficoReceitaDespesa,
};
