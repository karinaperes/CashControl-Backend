const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");

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

async function ajustarValorNegativo(movimento) {
  const Classe = require("./Classe");
  const classe = await Classe.findByPk(movimento.classe_id, {
    include: [{ association: 'tipoMov' }]
  });
  
  if (classe && classe.tipoMov) {
    if (classe.tipoMov.nome_tipo_mov.toLowerCase() === "despesa") {
      movimento.valor = Math.abs(movimento.valor) * -1;
    } else {
      movimento.valor = Math.abs(movimento.valor);
    }
  }
}

Movimento.beforeCreate(ajustarValorNegativo);
Movimento.beforeUpdate(ajustarValorNegativo);

module.exports = Movimento;
