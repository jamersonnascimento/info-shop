const db = require('../models');
const Client = db.Client;
const Person = db.Person;
const Address = db.Address;
const Cart = db.Cart; 
const { Op } = require('sequelize');

// Constantes para definir ordem dos atributos
const CLIENT_ATTRIBUTES = [
  'id_cliente',
  'id_pessoa',
  'senha_hash',
  'criado_em',
  'atualizado_em'
];

const PERSON_ATTRIBUTES = [
  'nome',
  'cpf',
  'email',
  'telefone',
  'data_nasc'
];

const ADDRESS_ATTRIBUTES = [
  'id_endereco',
  'rua',
  'numero',
  'bairro',
  'cidade',
  'estado',
  'cep'
];

const CART_ATTRIBUTES = [
  'id_carrinho',
  'status',
  'criado_em'
];

// Criar um novo Cliente
exports.create = async (req, res) => {
  try {
    const { id_pessoa, senha_hash } = req.body;

    // Validações detalhadas
    if (!id_pessoa || !senha_hash) {
      return res.status(400).json({ 
        message: 'Os campos id_pessoa e senha_hash são obrigatórios.' 
      });
    }

    // Verifica se a pessoa existe
    const person = await Person.findByPk(id_pessoa);
    if (!person) {
      return res.status(404).json({ 
        message: 'Pessoa não encontrada.' 
      });
    }

    // Verifica se a pessoa já é um cliente
    const existingClient = await Client.findOne({
      where: { id_pessoa }
    });

    if (existingClient) {
      return res.status(409).json({ 
        message: 'Esta pessoa já é um cliente.' 
      });
    }

    // Criação do Cliente
    const client = await Client.create({ 
      id_pessoa, 
      senha_hash 
    });

    // Busca o cliente com todos os dados da pessoa
    const newClient = await Client.findByPk(client.id_cliente, {
      include: [{
        model: Person,
        as: 'personInfo',
        attributes: ['nome', 'email', 'cpf', 'telefone', 'data_nasc']
      }]
    });

    res.status(201).json({
      message: 'Cliente criado com sucesso!',
      data: newClient
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao criar o cliente.', 
      error: error.message 
    });
  }
};

// Buscar todos os Clientes com paginação
exports.findAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const where = search ? {
      [Op.or]: [
        { '$personInfo.nome$': { [Op.iLike]: `%${search}%` } },
        { '$personInfo.email$': { [Op.iLike]: `%${search}%` } },
        { '$personInfo.cpf$': { [Op.like]: `%${search}%` } }
      ]
    } : {};

    const { count, rows } = await Client.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      raw: true,
      nest: true,
      attributes: CLIENT_ATTRIBUTES,
      include: [
        {
          model: Person,
          as: 'personInfo',
          attributes: PERSON_ATTRIBUTES
        },
        {
          model: Address,
          as: 'addresses',
          attributes: ADDRESS_ATTRIBUTES
        },
        {
          model: Cart,
          as: 'cart',
          attributes: CART_ATTRIBUTES
        }
      ],
      order: [['criado_em', 'DESC']]
    });

    // Reorganiza os dados antes de enviar
    const formattedRows = rows.map(row => {
      const { personInfo, addresses, cart, ...clientData } = row;
      const { nome, cpf, email, telefone, data_nasc } = personInfo;

      return {
        ...clientData,
        personInfo: {
          nome,
          cpf,
          email,
          telefone,
          data_nasc
        },
        addresses,
        cart: cart || null // Garante que retorne null se não houver carrinho
      };
    });

    res.status(200).json({
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: formattedRows
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar os clientes.', 
      error: error.message 
    });
  }
};

// Buscar um Cliente pelo ID
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id, {
      include: [
        {
          model: Person,
          as: 'personInfo',
          attributes: PERSON_ATTRIBUTES
        },
        {
          model: Address,
          as: 'addresses',
          attributes: ADDRESS_ATTRIBUTES
        },
        {
          model: Cart,
          as: 'cart',
          attributes: CART_ATTRIBUTES
        }
      ]
    });

    if (!client) {
      return res.status(404).json({ 
        message: 'Cliente não encontrado.' 
      });
    }

    res.status(200).json(client);
  } catch (error) {
    console.error('Erro detalhado:', error); // Log para debug
    res.status(500).json({ 
      message: 'Erro ao buscar o cliente.', 
      error: error.message 
    });
  }
};


// Atualizar um Cliente pelo ID
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { senha_hash, id_pessoa } = req.body;

    // Verifica se está tentando atualizar id_pessoa
    if (id_pessoa) {
      return res.status(400).json({ 
        message: 'Não é permitido alterar a associação do cliente com a pessoa.' 
      });
    }

    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ 
        message: 'Cliente não encontrado para atualização.' 
      });
    }

    // Atualiza apenas a senha
    await client.update({ senha_hash });

    const updatedClient = await Client.findByPk(id, {
      include: [{
        model: Person,
        as: 'personInfo',
        attributes: ['nome', 'email', 'cpf', 'telefone', 'data_nasc']
      }]
    });

    res.status(200).json({
      message: 'Cliente atualizado com sucesso!',
      data: updatedClient
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao atualizar o cliente.', 
      error: error.message 
    });
  }
};

// Deletar um Cliente pelo ID
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ 
        message: 'Cliente não encontrado.' 
      });
    }

    await client.destroy();

    res.status(200).json({ 
      message: 'Cliente excluído com sucesso.',
      data: { id }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao excluir o cliente.', 
      error: error.message 
    });
  }
};

// Deletar todos os Clientes (apenas em desenvolvimento)
exports.deleteAll = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ 
          message: 'Operação não permitida em ambiente de produção.' 
      });
  }

  try {
      const result = await Client.destroy({
          where: {},
          force: true // hard delete
      });

      res.status(200).json({ 
          message: `${result} cliente(s) foram excluídos com sucesso.`
      });
  } catch (error) {
      res.status(500).json({ 
          message: 'Erro ao excluir os clientes.',
          error: error.message 
      });
  }
};