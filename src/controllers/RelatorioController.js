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
    return res
      .status(500)
      .json({ message: "Erro ao listar movimentos", error: error.message });
  }
};

const graficoReceitaDespesa = async (req, res) => {
  try {
    const { data_inicial, data_final } = req.query;

    // 1. Obter datas do mês atual (padrão)
    const now = new Date();
    const primeiroDiaMes = new Date(now.getFullYear(), now.getMonth(), 1);
    const ultimoDiaMes = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // 2. Função para formatar e validar datas
    const parseDate = (dateString, fallback) => {
      if (!dateString) return fallback;
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? fallback : date;
    };

    // 3. Definir datas finais (usar padrão se não fornecido)
    const dataInicial = parseDate(data_inicial, primeiroDiaMes);
    const dataFinal = parseDate(data_final, ultimoDiaMes);

    // 4. Criar filtro para ambas consultas
    const filtroDatas = {
      data: { 
        [Op.between]: [dataInicial, dataFinal] 
      }
    };

    // CONSULTA 1: Totais por Tipo (Receita/Despesa)
    const totaisPorTipo = await Movimento.findAll({
      where: filtroDatas,
      include: [
        {
          model: Classe,
          as: "classe",
          attributes: [],
          include: [
            {
              model: TipoMov,
              as: "tipoMov",
              attributes: [],
            },
          ],
        },
      ],
      attributes: [
        [fn("SUM", col("valor")), "total"],
        [col("classe.tipoMov.nome_tipo_mov"), "tipo"],
      ],
      group: ["classe.tipoMov.nome_tipo_mov"],
      raw: true,
    });

    // CONSULTA 2: Totais por Classe
    const totaisPorClasse = await Movimento.findAll({
      where: filtroDatas, // Usando o mesmo filtro
      include: [
        {
          association: "classe",
          attributes: ["nome_classe"],
          include: [
            {
              association: "tipoMov",
              attributes: [],
            },
          ],
        },
      ],
      attributes: [
        [fn("SUM", col("valor")), "total"],
        [col("classe.nome_classe"), "classe"],
        [col("classe.tipoMov.nome_tipo_mov"), "tipo"],
      ],
      group: ["classe.nome_classe", "classe.tipoMov.nome_tipo_mov"],
      raw: true,
    });

    // Processamento dos resultados
    const receita = parseFloat(
      totaisPorTipo.find((t) => t.tipo && t.tipo.toLowerCase() === "receita")?.total || 0
    );

    const despesa = Math.abs(
      parseFloat(
        totaisPorTipo.find((t) => t.tipo && t.tipo.toLowerCase() === "despesa")?.total || 0
      )
    );

    // Retornar resultado com período usado
    const resultado = {
      periodo: {
        inicio: dataInicial.toISOString().split('T')[0],
        fim: dataFinal.toISOString().split('T')[0],
        padrao: !data_inicial && !data_final // Indica se usou datas padrão
      },
      grafico: {
        receita,
        despesa,
        saldo: receita - despesa,
      },
      classes: totaisPorClasse.map((item) => ({
        classe: item.classe,
        tipo: item.tipo,
        total: Math.abs(parseFloat(item.total) || 0),
        percentual: (
          (Math.abs(parseFloat(item.total)) / (receita + despesa)) * 100
        ).toFixed(2),
      })),
    };

    return res.status(200).json(resultado);
    
  } catch (error) {
    console.error("Erro detalhado:", error);
    return res.status(500).json({
      message: "Erro ao gerar relatório",
      error: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};

module.exports = {
  listarMovimentos,
  graficoReceitaDespesa,
};
