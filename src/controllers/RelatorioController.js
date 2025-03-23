const { Op, fn, col } = require("sequelize");
const Movimento = require("../models/Movimento");
const Classe = require("../models/Classe");
const TipoMov = require("../models/TipoMov");

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
      agrupar_por,
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

    let groupBy = [];
    if (agrupar_por) {
      const opcoesPermitidas = ["classe_id", "data", "vencimento", "pagamento"];
      if (opcoesPermitidas.includes(agrupar_por)) {
        groupBy.push(agrupar_por);
      }
    } else {
      groupBy.push("classe_id"); // Agrupamento padrão por classe
    }

    const movimentos = await Movimento.findAll({
      where: filtros,
      include: [
        {
          model: Classe,
          as: "classe",
          include: [
            {
              model: TipoMov,
              as: "tipoMov",
            },
          ],
        },
      ],
      attributes: [
        agrupar_por || "classe_id", "classe.nome_classe",
        [fn("SUM", col("valor")), "total"], // Soma dos valores já ajustados no banco
      ],
      group: [
        agrupar_por || "classe_id", "classe.nome_classe" // Agrupar apenas por classe_id
      ],
    });

    // Calcular o total geral para calcular os percentuais
    const totalGeral = movimentos.reduce((acc, movimento) => acc + parseFloat(movimento.dataValues.total), 0);

    // Adicionar o percentual para cada classe
    const resultadoComPercentuais = movimentos.map((movimento) => {
      const percentual = totalGeral ? ((parseFloat(movimento.dataValues.total) / totalGeral) * 100).toFixed(2) : 0;
      return {
        nome_classe: movimento.dataValues["classe.nome_classe"],
        total: movimento.dataValues.total,
        percentual,
      };
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
