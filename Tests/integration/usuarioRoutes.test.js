const request = require('supertest')
const { Server } = require('../../src/server')  // Importa a classe Server
const serverInstance = new Server()  // Instancia a classe Server

describe('POST /usuario', () => {
    let app;

    beforeAll(() => {
        app = serverInstance.getApp();  // Obtenha o app (servidor Express)
    })

    it('deve cadastrar um novo usuário', async () => {
        const response = await request(app)
            .post('/usuario')
            .send({
                nome: 'Teste',
                email: 'teste@example.com',
                senha: 'senha123'
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('nome', 'Teste');
        expect(response.body).toHaveProperty('email', 'teste@example.com');
    });

    it('deve retornar erro ao cadastrar usuário com email duplicado', async () => {
        await request(app)
            .post('/usuario')
            .send({
                nome: 'Teste',
                email: 'teste@example.com',
                senha: 'senha123'
            });

        const response = await request(app)
            .post('/usuario')
            .send({
                nome: 'Teste',
                email: 'teste@example.com',
                senha: 'senha123'
            });

        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty('mensagem', 'Email já cadastrado!');
    });
});
