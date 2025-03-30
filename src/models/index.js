// src/models/index.js
const { connection } = require('../database/connection');
const Classe = require('./Classe');
const TipoMov = require('./TipoMov');
const Movimento = require('./Movimento');

// Exporte todos os modelos e a conexão
module.exports = {
  connection,
  Classe,
  TipoMov,
  Movimento
};
