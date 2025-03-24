const db = require('../models');
const Cart = db.Cart;
const Client = db.Client;
const Person = db.Person;
const { Op } = require('sequelize');

// Constantes para definir ordem dos atributos
const CART_ATTRIBUTES = [
  'id_carrinho',
  'id_cliente',
  'status',
  'criado_em'
];

const CLIENT_ATTRIBUTES = [
  'id_cliente',
  'criado_em'
];

const PERSON_ATTRIBUTES = [
  'nome',
  'email',
  'telefone'
];

// Criar um novo Carrinho
exports.create = async (req, res) => {
  try {
    const { id_cliente } = req.body;

    // Validações detalhadas
    if (!id_cliente) {
      return res.status(400).json({ 
        message: 'ID do cliente é obrigatório.' 
      });
    }

    // Verifica se o cliente existe e já traz os dados da pessoa
    const client = await Client.findByPk(id_cliente, {
      include: [{
        model: Person,
        as: 'personInfo',
        attributes: PERSON_ATTRIBUTES
      }]
    });

    if (!client) {
      return res.status(404).json({ 
        message: 'Cliente não encontrado.' 
      });
    }

    // Verifica se o cliente já tem um carrinho
    const existingCart = await Cart.findOne({
      where: { id_cliente }
    });

    if (existingCart) {
      return res.status(409).json({ 
        message: 'Este cliente já possui um carrinho.' 
      });
    }

    // Criação do Carrinho
    const cart = await Cart.create({ 
      id_cliente,
      status: 'ativo'
    });

    // Busca o carrinho criado com todas as relações
    const createdCart = await Cart.findByPk(cart.id_carrinho, {
      include: [{
        model: Client,
        as: 'clientInfo',
        attributes: CLIENT_ATTRIBUTES,
        include: [{
          model: Person,
          as: 'personInfo',
          attributes: PERSON_ATTRIBUTES
        }]
      }]
    });

    res.status(201).json({
      message: 'Carrinho criado com sucesso!',
      data: createdCart
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao criar o carrinho.', 
      error: error.message 
    });
  }
};

// Buscar um Carrinho específico
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findByPk(id, {
      include: [{
        model: Client,
        as: 'clientInfo',
        attributes: CLIENT_ATTRIBUTES,
        include: [{
          model: Person,
          as: 'personInfo',
          attributes: PERSON_ATTRIBUTES
        }]
      }]
    });

    if (!cart) {
      return res.status(404).json({ 
        message: 'Carrinho não encontrado.' 
      });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar o carrinho.', 
      error: error.message 
    });
  }
};

// Buscar todos os Carrinhos com paginação
exports.findAll = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status = '', 
      sortBy = 'criado_em', 
      order = 'DESC' 
    } = req.query;

    const offset = (page - 1) * limit;

    const where = status ? { status } : {};

    const { count, rows } = await Cart.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, order]],
      include: [{
        model: Client,
        as: 'clientInfo',
        attributes: CLIENT_ATTRIBUTES,
        include: [{
          model: Person,
          as: 'personInfo',
          attributes: PERSON_ATTRIBUTES
        }]
      }]
    });

    res.status(200).json({
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: rows
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar os carrinhos.', 
      error: error.message 
    });
  }
};

// Atualizar status do Carrinho
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['ativo', 'abandonado', 'finalizado'].includes(status)) {
      return res.status(400).json({ 
        message: 'Status inválido. Use: ativo, abandonado ou finalizado' 
      });
    }

    const cart = await Cart.findByPk(id);
    if (!cart) {
      return res.status(404).json({ 
        message: 'Carrinho não encontrado.' 
      });
    }

    await cart.update({ status });

    const updatedCart = await Cart.findByPk(id, {
      include: [{
        model: Client,
        as: 'clientInfo',
        attributes: CLIENT_ATTRIBUTES,
        include: [{
          model: Person,
          as: 'personInfo',
          attributes: PERSON_ATTRIBUTES
        }]
      }]
    });

    res.status(200).json({
      message: 'Status do carrinho atualizado com sucesso!',
      data: updatedCart
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao atualizar o status do carrinho.', 
      error: error.message 
    });
  }
};

// Deletar um Carrinho
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const cart = await Cart.findByPk(id);
    if (!cart) {
      return res.status(404).json({ 
        message: 'Carrinho não encontrado.' 
      });
    }

    // Verifica se o carrinho está finalizado
    if (cart.status === 'finalizado') {
      return res.status(403).json({ 
        message: 'Não é possível excluir um carrinho finalizado.' 
      });
    }

    await cart.destroy();

    res.status(200).json({ 
      message: 'Carrinho excluído com sucesso.',
      data: { id }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao excluir o carrinho.', 
      error: error.message 
    });
  }
};