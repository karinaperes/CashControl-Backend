const { DataTypes } = require("sequelize");
const { connection } = require("../database/connection");
const TipoMov = require("./TipoMov"); // Importação do modelo TipoMov

const Classe = connection.define("classes", {
  nome_classe: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  tipo_mov_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "tipos_movs",
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

// 🔗 Cria a associação entre Classe e TipoMov
Classe.belongsTo(TipoMov, { foreignKey: "tipo_mov_id", as: "tipoMov" });

module.exports = Classe;
