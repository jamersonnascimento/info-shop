// payment.controller.js
const db = require('../models');
const Payment = db.Payment;
const Order = db.Order;
const { Op } = require('sequelize');

// Constantes para definir ordem dos atributos
const PAYMENT_ATTRIBUTES = [
  'id_pagamento',
  'id_pedido',
  'valor',
  'metodo',
  'status',
  'data_pagamento',
  'criado_em',
  'atualizado_em'
];

const ORDER_ATTRIBUTES = [
  'id_pedido',
  'status',
  'total'  // Agora usando o nome correto do campo
];

// Criar um novo Pagamento
exports.create = async (req, res) => {
  try {
    const { id_pedido, metodo } = req.body; // Removemos valor do destructuring

    // Validações detalhadas
    if (!id_pedido || !metodo) {
      return res.status(400).json({ 
        message: 'Os campos id_pedido e metodo são obrigatórios.' 
      });
    }

    // Verifica se o pedido existe e pega seu valor total
    const order = await Order.findByPk(id_pedido);
    if (!order) {
      return res.status(404).json({ 
        message: 'Pedido não encontrado.' 
      });
    }

    // Verifica se já existe pagamento para este pedido
    const existingPayment = await Payment.findOne({
      where: { id_pedido }
    });

    if (existingPayment) {
      return res.status(409).json({ 
        message: 'Já existe um pagamento para este pedido.' 
      });
    }

    // Validação do método de pagamento
    const metodosValidos = ['cartao_credito', 'cartao_debito', 'pix', 'boleto'];
    if (!metodosValidos.includes(metodo)) {
      return res.status(400).json({ 
        message: 'Método de pagamento inválido.' 
      });
    }

    // Criação do Pagamento usando o total do pedido
    const payment = await Payment.create({ 
      id_pedido,
      valor: order.total, // Usa o valor total do pedido
      metodo,
      status: 'pendente',
      data_pagamento: null
    });

    // Busca o pagamento criado com os atributos ordenados
    const newPayment = await Payment.findByPk(payment.id_pagamento, {
      attributes: PAYMENT_ATTRIBUTES,
      include: [{
        model: Order,
        as: 'order',
        attributes: ORDER_ATTRIBUTES
      }]
    });

    res.status(201).json({
      message: 'Pagamento criado com sucesso!',
      data: newPayment
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao criar o pagamento.', 
      error: error.message 
    });
  }
};

// Buscar todos os Pagamentos com paginação
exports.findAll = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status = '', 
      metodo = '',
      sortBy = 'criado_em', 
      order = 'DESC' 
    } = req.query;

    const offset = (page - 1) * limit;

    // Construção do where dinâmico
    const where = {};
    if (status) where.status = status;
    if (metodo) where.metodo = metodo;

    const { count, rows } = await Payment.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, order]],
      attributes: PAYMENT_ATTRIBUTES,
      include: [{
        model: Order,
        as: 'order',
        attributes: ORDER_ATTRIBUTES
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
      message: 'Erro ao buscar pagamentos.', 
      error: error.message 
    });
  }
};

// Buscar um Pagamento pelo ID
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id, {
      attributes: PAYMENT_ATTRIBUTES,
      include: [{
        model: Order,
        as: 'order',
        attributes: ORDER_ATTRIBUTES
      }]
    });

    if (!payment) {
      return res.status(404).json({ 
        message: 'Pagamento não encontrado.' 
      });
    }

    res.status(200).json({
      data: payment
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar o pagamento.', 
      error: error.message 
    });
  }
};

// Atualizar um Pagamento
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, data_pagamento } = req.body;

    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).json({ 
        message: 'Pagamento não encontrado.' 
      });
    }

    // Validação do status
    const statusValidos = ['pendente', 'aprovado', 'recusado', 'cancelado'];
    if (status && !statusValidos.includes(status)) {
      return res.status(400).json({ 
        message: 'Status de pagamento inválido.' 
      });
    }

    // Atualização do Pagamento
    await payment.update({
      status: status || payment.status,
      data_pagamento: data_pagamento || payment.data_pagamento,
      atualizado_em: new Date()
    });

    // Busca o pagamento atualizado
    const updatedPayment = await Payment.findByPk(id, {
      attributes: PAYMENT_ATTRIBUTES,
      include: [{
        model: Order,
        as: 'order',
        attributes: ORDER_ATTRIBUTES
      }]
    });

    res.status(200).json({
      message: 'Pagamento atualizado com sucesso!',
      data: updatedPayment
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao atualizar o pagamento.', 
      error: error.message 
    });
  }
};

// Deletar um Pagamento
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).json({ 
        message: 'Pagamento não encontrado.' 
      });
    }

    // Verifica se o pagamento pode ser deletado
    if (payment.status === 'aprovado') {
      return res.status(400).json({ 
        message: 'Não é possível deletar um pagamento aprovado.' 
      });
    }

    await payment.destroy();

    res.status(200).json({
      message: 'Pagamento deletado com sucesso!'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao deletar o pagamento.', 
      error: error.message 
    });
  }
};