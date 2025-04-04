// This file contains controller functions for managing payments in the application.
// It includes operations such as creating, retrieving, updating, and deleting payments.

const db = require('../models');
const Payment = db.Payment;
const Order = db.Order;
const { Op } = require('sequelize');

// Constants to define the order of attributes for Payment and Order
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
  'total'
];

// Create a new Payment
exports.create = async (req, res) => {
  try {
    const { id_pedido, metodo } = req.body;

    // Validate required fields
    if (!id_pedido || !metodo) {
      return res.status(400).json({ 
        message: 'Os campos id_pedido e metodo são obrigatórios.' 
      });
    }

    // Check if the order exists and get its total value
    const order = await Order.findByPk(id_pedido);
    if (!order) {
      return res.status(404).json({ 
        message: 'Pedido não encontrado.' 
      });
    }

    // Check if a payment already exists for this order
    const existingPayment = await Payment.findOne({
      where: { id_pedido }
    });

    if (existingPayment) {
      return res.status(409).json({ 
        message: 'Já existe um pagamento para este pedido.' 
      });
    }

    // Validate the payment method
    const metodosValidos = ['cartao_credito', 'cartao_debito', 'pix', 'boleto'];
    if (!metodosValidos.includes(metodo)) {
      return res.status(400).json({ 
        message: 'Método de pagamento inválido.' 
      });
    }

    // Create the Payment using the order's total value
    const payment = await Payment.create({ 
      id_pedido,
      valor: order.total,
      metodo,
      status: 'pendente',
      data_pagamento: null
    });

    // Retrieve the created payment with ordered attributes
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

// Retrieve all Payments with pagination
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

    // Build dynamic where clause
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

// Retrieve a Payment by ID
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

// Update a Payment
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

    // Validate the status
    const statusValidos = ['pendente', 'aprovado', 'recusado', 'cancelado'];
    if (status && !statusValidos.includes(status)) {
      return res.status(400).json({ 
        message: 'Status de pagamento inválido.' 
      });
    }

    // Update the Payment
    await payment.update({
      status: status || payment.status,
      data_pagamento: data_pagamento || payment.data_pagamento,
      atualizado_em: new Date()
    });

    // Retrieve the updated payment
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

// Delete a Payment
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id);

    if (!payment) {
      return res.status(404).json({ 
        message: 'Pagamento não encontrado.' 
      });
    }

    // Check if the payment can be deleted
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