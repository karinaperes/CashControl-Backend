const ContaController = require('../../src/controllers/ContaController');
const Conta = require('../../src/models/Conta');
const Usuario = require('../../src/models/Usuario');
const TipoMov = require('../../src/models/TipoMov');
const Classe = require('../../src/models/Classe');
const Movimento = require('../../src/models/Movimento');

describe('Erros no ContaController', () => {
  let usuarioCriado;
  let classeCriada;
  let tipoMovCriado;
  let contaCriada;

  beforeAll(async () => {
    usuarioCriado = await Usuario.create({
      nome: 'Usuário Teste',
      email: 'teste@email.com',
      senha: '12345',
    });
  });

  beforeEach(async () => {
    jest.restoreAllMocks(); // Restaura todos os mocks antes de cada teste
    await Conta.destroy({ where: {} }); // Limpa o banco antes de cada teste
  });

  afterAll(async () => {
    await Conta.sequelize.close(); // Fecha conexão com o banco após os testes
  });

  it('deve retornar 400 ao tentar cadastrar sem nome', async () => {
    const req = {
      body: {
        nome_conta: '',
        usuario_id: usuarioCriado.id,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await ContaController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) })
    );
  });

  it('deve retornar 409 ao tentar cadastrar com descricao já existente', async () => {
    await Conta.create({
      nome_conta: 'Teste',
      usuario_id: usuarioCriado.id,
    });

    const req = {
      body: {
        nome_conta: 'Teste',
        usuario_id: usuarioCriado.id,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await ContaController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensagem: 'Conta já cadastrada!' })
    );
  });

  it('deve retornar 500 ao ocorrer um erro interno no cadastro', async () => {
    jest.spyOn(Conta, 'create').mockRejectedValue(new Error('Erro interno'));

    const req = {
      body: {
        nome_conta: 'Teste',
        usuario_id: usuarioCriado.id,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await ContaController.cadastrar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        erro: 'Não foi possível cadastrar a conta.',
      })
    );
  });

  it('deve retornar 404 ao tentar listar uma conta inexistente', async () => {
    const req = { params: { id: 9999 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(Conta, 'findByPk').mockResolvedValue(null);

    await ContaController.listarUm(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensagem: 'Conta não encontrada!' })
    );
  });

  it('deve retornar 500 ao ocorrer um erro interno na busca de uma conta', async () => {
    jest.spyOn(Conta, 'findByPk').mockRejectedValue(new Error('Erro interno'));

    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await ContaController.listarUm(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        erro: 'Não foi possível listar a conta.',
      })
    );
  });

  it('deve retornar 404 ao tentar excluir uma conta inexistente', async () => {
    const req = { params: { id: 9999 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(Conta, 'findByPk').mockResolvedValue(null);

    await ContaController.excluir(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ mensagem: 'Conta não encontrada!' })
    );
  });

  it('deve retornar 500 ao ocorrer um erro interno na exclusão', async () => {
    jest.spyOn(Conta, 'findByPk').mockResolvedValue({
      destroy: jest.fn().mockRejectedValue(new Error('Erro interno')),
    });

    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await ContaController.excluir(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        erro: 'Não foi possível excluir a conta.',
      })
    );
  });

  it('deve impedir exclusão de conta vinculada a um movimento', async () => {
    tipoMovCriado = await TipoMov.create({
      nome_tipo_mov: 'Tipo Mov teste',
      usuario_id: usuarioCriado.id,
    });

    classeCriada = await Classe.create({
      nome_classe: 'Classe Teste',
      usuario_id: usuarioCriado.id,
      tipo_mov_id: tipoMovCriado.id,
    });

    contaCriada = await Conta.create({
      nome_conta: 'Conta Teste',
      usuario_id: usuarioCriado.id,
    });

    await Movimento.create({
      data: '05/01/2025',
      vencimento: '05/01/2025',
      data_pagamento: null,
      classe_id: classeCriada.id,
      usuario_id: usuarioCriado.id,
      descricao: 'Movimento Teste',
      valor: 100.0,
      conta_id: contaCriada.id, // Associa o movimento à conta criada
    });

    // Tenta excluir a conta vinculada ao movimento
    const req = { params: { id: contaCriada.id } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await ContaController.excluir(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        erro: 'Esta conta está vinculada a um movimento e não pode ser excluída.',
      })
    );
  });
});
