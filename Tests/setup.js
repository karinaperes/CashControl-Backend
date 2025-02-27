const { connection } = require('../src/database/connection');

beforeAll(async () => {
  try {
    await connection.sync({ force: true });
    console.log('Banco de dados sincronizado com sucesso.');
  } catch (error) {
    console.error('Erro ao sincronizar o banco de dados:', error);
  }
});

afterAll(async () => {
  await connection.close();
});
