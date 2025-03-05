const UsuarioController = require('../../src/controllers/UsuarioController')
const Usuario = require('../../src/models/Usuario')

describe('Erros no UsuarioController', () => {
  beforeEach(async () => {
    await Usuario.destroy({ where: {} }) // Limpa o banco antes de cada teste
  })

  afterAll(async () => {
    await Usuario.sequelize.close() // Fecha conexão com o banco após os testes
  })

  it('deve retornar 400 ao tentar cadastrar sem nome', async () => {
    const req = {
      body: {
        email: 'teste@example.com',
        senha: 'senha123'
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    await UsuarioController.cadastrar(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ errors: expect.any(Array) })
    );
  })

  it('deve retornar 400 ao tentar cadastrar com email inválido', async () => {
    const req = {
      body: {
        nome: 'Usuário Teste',
        email: 'email-invalido',
        senha: 'senha123'
      }
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

    await UsuarioController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ errors: expect.any(Array) })
    );
})  
  it('deve retornar 409 ao tentar cadastrar com email já existente', async () => {
    await Usuario.create({
      nome: 'Usuário Teste',
      email: 'teste@example.com',
      senha: 'senha123'
    })

    const req = {
      body: {
        nome: 'Novo Usuário',
        email: 'teste@example.com', // Mesmo email já cadastrado
        senha: 'senha123'
      }
    }

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }

    await UsuarioController.cadastrar(req, res)

    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      mensagem: 'E-mail já cadastrado!'
    }))
  })

  it('deve retornar 400 ao tentar cadastrar com senha menor que 4 caracteres', async () => {
    const req = {
      body: {
        nome: 'Usuário Teste',
        email: 'teste@example.com',
        senha: '123'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await UsuarioController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) })
    );
  });

  it('deve retornar 500 ao ocorrer um erro interno no cadastro', async () => {
    jest.spyOn(Usuario, 'create').mockRejectedValue(new Error('Erro interno'));

    const req = {
      body: {
        nome: 'Usuário Teste',
        email: 'teste@example.com',
        senha: 'senha123'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await UsuarioController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ erro: 'Não foi possível efetuar o cadastro do usuário.' })
    );
  });

  it('deve retornar 500 ao ocorrer um erro interno na listagem de usuários', async () => {
    jest.spyOn(Usuario, 'findAll').mockRejectedValue(new Error('Erro interno'));
  
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  
    await UsuarioController.listar(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ erro: 'Não foi possível listar os usuários.' })
    );
  });
    
})
