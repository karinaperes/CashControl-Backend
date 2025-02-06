const { connection } = require('../src/database/connection');

beforeAll(async () => {
  await connection.sync({ force: true })
})

afterAll(async () => {
  await connection.close()
})
