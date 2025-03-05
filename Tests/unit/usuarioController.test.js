const UsuarioController = require('../../src/controllers/UsuarioController')
const Usuario = require('../../src/models/Usuario')

describe('UsuarioController', () => {
  beforeEach(async () => {
    // Limpa o banco antes de cada teste para evitar interferências
    await Usuario.destroy({ where: {} })
  })

  afterAll(async () => {
    // Fecha conexão com o banco após os testes
    await Usuario.sequelize.close()
  })

  describe('Cadastrar usuário', () => {
    it('deve cadastrar um novo usuário', async () => {
      const req = {
        body: {
          nome: 'Teste',
          email: 'teste@example.com',
          senha: 'senha123'
        }
      }

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      await UsuarioController.cadastrar(req, res)

      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        nome: 'Teste',
        email: 'teste@example.com'
      }))
    })
  })

  describe('Listar usuários', () => {
    beforeEach(async () => {
      await Usuario.create({
        nome: 'Usuário Teste',
        email: 'teste@example.com',
        senha: 'senha123'
      })
    })

    it('deve listar todos os usuários', async () => {
      const req = {} // Nenhum parâmetro necessário para listagem
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      }

      await UsuarioController.listar(req, res)

      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          nome: 'Usuário Teste',
          email: 'teste@example.com'
        })
      ]))
    })
  })
})
