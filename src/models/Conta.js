const { DataTypes } = require("sequelize"); // Importando o componente DataTypes do Sequelize
const { connection } = require("../database/connection");

const Conta = connection.define("contas", {
  nome_conta: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
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

module.exports = Conta;
