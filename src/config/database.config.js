const { config } = require('dotenv'); // Importa a função config do pacote dotenv, que carrega as variáveis do arquivo .env para o objeto process.env
config();
module.exports = {
  dialect: process.env.DIALECT, //Qual banco de dados está utilizando
  host: process.env.DB_HOST, //Qual servidor está utilizando
  username: process.env.DB_USER, //Qual o nome do seu usuário no postgres
  password: process.env.DB_PASSWORD, //Qual a senha do seu usuário no postgres
  database: process.env.DB_NAME, //Qual o nome do seu database no postgres
  port: process.env.DB_PORT, //Qual porta do seu postgres (Normalmente é a 5432)
};
