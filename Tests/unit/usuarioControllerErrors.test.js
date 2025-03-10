const UsuarioController = require('../../src/controllers/UsuarioController');
const Usuario = require('../../src/models/Usuario');

describe('Erros no UsuarioController', () => {
  beforeEach(async () => {
    jest.restoreAllMocks(); // Restaura todos os mocks antes de cada teste
    await Usuario.destroy({ where: {} }); // Limpa o banco antes de cada teste
  });

  afterAll(async () => {
    await Usuario.sequelize.close(); // Fecha conexão com o banco após os testes
  });

  it('deve retornar 400 ao tentar cadastrar sem nome', async () => {
    const req = {
      body: {
        email: 'teste@example.com',
        senha: 'senha123',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await UsuarioController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) })
    );
  });

  it('deve retornar 400 ao tentar cadastrar com email inválido', async () => {
    const req = {
      body: {
        nome: 'Usuário Teste',
        email: 'email-invalido',
        senha: 'senha123',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await UsuarioController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) })
    );
  });
  it('deve retornar 409 ao tentar cadastrar com email já existente', async () => {
    await Usuario.create({
      nome: 'Usuário Teste',
      email: 'teste@example.com',
      senha: 'senha123',
    });

    const req = {
      body: {
        nome: 'Novo Usuário',
        email: 'teste@example.com', // Mesmo email já cadastrado
        senha: 'senha123',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await UsuarioController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        mensagem: 'E-mail já cadastrado!',
      })
    );
  });

  it('deve retornar 400 ao tentar cadastrar com senha menor que 4 caracteres', async () => {
    const req = {
      body: {
        nome: 'Usuário Teste',
        email: 'teste@example.com',
        senha: '123',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
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
        senha: 'senha123',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await UsuarioController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        erro: 'Não foi possível efetuar o cadastro do usuário.',
      })
    );
  });

  it('deve retornar 500 ao ocorrer um erro interno na listagem de usuários', async () => {
    jest.spyOn(Usuario, 'findAll').mockRejectedValue(new Error('Erro interno'));

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await UsuarioController.listar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ erro: 'Não foi possível listar os usuários.' })
    );
  });

  it('deve retornar 404 ao tentar listar um usuário inexistente', async () => {
    jest
      .spyOn(Usuario, 'update')
      .mockRejectedValue(new Error('Dados inexistentes'));
    const req = { params: { id: 9999 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // MOCKANDO O REPOSITÓRIO/ SERVIÇO
    jest.spyOn(Usuario, 'findOne').mockResolvedValue(null);

    await UsuarioController.listarUm(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensagem: 'Usuário não encontrado!' })
    );
  });

  it('deve retornar 500 ao ocorrer um erro interno na busca de um usuário', async () => {
    jest
      .spyOn(Usuario, 'findByPk')
      .mockRejectedValue(new Error('Erro interno'));

    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await UsuarioController.listarUm(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ erro: 'Não foi possível listar o usuário.' })
    );
  });

  // ====== ATUALIZAR USUÁRIO ======
  it('deve retornar 404 ao tentar atualizar um usuário inexistente', async () => {
    const req = {
      params: { id: 9999 },
      body: {
        nome: 'Novo Nome',
        email: 'novoemail@email.com',
        senha: '1234',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(Usuario, 'findByPk').mockResolvedValue(null);

    await UsuarioController.atualizar(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensagem: 'Usuário não encontrado!' })
    );
  });

  it('deve retornar 400 ao tentar atualizar com dados inválidos', async () => {
    const usuarioCriado = await Usuario.create({
      nome: 'Usuário Teste',
      email: 'teste1@example.com',
      senha: 'senha123',
    });

    jest.spyOn(Usuario, 'update').mockRejectedValue(new Error('Erro interno'));

    const req = {
      params: { id: usuarioCriado.id },
      body: {
        nome: '',
        email: '',
        senha: '',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await UsuarioController.atualizar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) })
    );
  });

  it('deve retornar 500 ao ocorrer um erro interno na atualização', async () => {
    jest.spyOn(Usuario, 'update').mockRejectedValue(new Error('Erro interno'));

    const req = {
      params: { id: 'a' },
      body: {
        nome: 'Novo Nome',
        email: 'email@email.com',
        senha: '12345',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await UsuarioController.atualizar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ erro: 'Não foi possível atualizar o usuário.' })
    );
  });

  // ====== EXCLUIR USUÁRIO ======
  it('deve retornar 404 ao tentar excluir um usuário inexistente', async () => {
    const req = { params: { id: 9999 } }; // ID inexistente
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(Usuario, 'findByPk').mockResolvedValue(null);

    await UsuarioController.excluir(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensagem: 'Usuário não encontrado!' })
    );
  });

  it('deve retornar 500 ao ocorrer um erro interno na exclusão', async () => {
    jest.spyOn(Usuario, 'findByPk').mockResolvedValue({
      destroy: jest.fn().mockRejectedValue(new Error('Erro interno')),
    });

    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await UsuarioController.excluir(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ erro: 'Não foi possível excluir o usuário.' })
    );
  });
});
