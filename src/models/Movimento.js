const { DataTypes } = require("sequelize"); // Importando o componente DataTypes do Sequelize
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

module.exports = Movimento;
