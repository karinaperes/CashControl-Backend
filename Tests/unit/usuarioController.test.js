const UsuarioController = require('../../src/controllers/UsuarioController')
const Usuario = require('../../src/models/Usuario')

describe('UsuarioController', () => {
  describe('cadastrar', () => {
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
})
