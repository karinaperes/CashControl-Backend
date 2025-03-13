const { DataTypes } = require("sequelize"); // Importando o componente DataTypes do Sequelize
const { connection } = require("../database/connection");
const Classe = require("./Classe");

const Movimento = connection.define("movimentos", {
  data: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  vencimento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  valor: {
    allowNull: false,
    type: DataTypes.DECIMAL(10, 2),
    // adicionar validação para decimal com vírgula
  },
  descricao: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  data_pagamento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  classe_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "classes",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  conta_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "contas",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "usuarios",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  },
});

Movimento.beforeCreate(ajustarValorNegativo);
Movimento.beforeUpdate(ajustarValorNegativo);

// Função auxiliar para ajustar o valor baseado no tipo de movimento
async function ajustarValorNegativo(movimento) {
  const classe = await Classe.findByPk(movimento.classe_id);
  if (classe) {
    const tipoMov = await classe.getTipoMov(); // Busca a relação com TipoMov
    if (tipoMov && tipoMov.nome_tipo_mov && tipoMov.nome_tipo_mov.toLowerCase() === "despesa") {
      movimento.valor = Math.abs(movimento.valor) * -1; // Garante que seja negativo
    } else {
      movimento.valor = Math.abs(movimento.valor); // Garante que receitas sejam positivas
    }
  }
}

Movimento.belongsTo(Classe, {
  foreignKey: "classe_id", // Esse é o campo que referencia a classe no modelo Movimento
  as: "classe", // Esse é o alias que você usará no `include` no controller
});

module.exports = Movimento;
