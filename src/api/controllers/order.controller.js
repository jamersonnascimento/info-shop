// This file contains controller functions for managing orders in the application.
// It includes operations such as creating, retrieving, updating, and deleting orders.

const db = require('../models');
const Order = db.Order;
const OrderItem = db.OrderItem;
const Client = db.Client;
const Person = db.Person;
const Product = db.Product;
const Cart = db.Cart;
const CartItem = db.CartItem;
const { Op } = require('sequelize');

// Constants to define the order of attributes for Order, Client, Person, OrderItem, and Product
const ORDER_ATTRIBUTES = [
  'id_pedido',
  'id_cliente',
  'status',
  'total',
  'id_cupom',
  'criado_em',
  'atualizado_em'
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

const ORDERITEM_ATTRIBUTES = [
  'id_item_pedido',
  'id_pedido',
  'id_produto',
  'quantidade',
  'preco_unit',
  'subtotal',
  'criado_em',
  'atualizado_em'
];

const PRODUCT_ATTRIBUTES = [
  'id_produto',
  'nome',
  'descricao',
  'preco',
  'estoque'
];

// Create a new Order
exports.create = async (req, res) => {
  try {
    const { id_cliente } = req.body;

    // Validate required fields
    if (!id_cliente) {
      return res.status(400).json({ 
        message: 'ID do cliente é obrigatório.' 
      });
    }

    // Check if the client exists and include person information
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

    // Create the Order
    const order = await Order.create({ 
      id_cliente,
      status: 'pendente',
      total: 0.00
    });

    // Return only the created order without including relations
    res.status(201).json({
      message: 'Pedido criado com sucesso!',
      data: order
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao criar o pedido.', 
      error: error.message 
    });
  }
};

// Create an order from a cart
exports.createFromCart = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { id_carrinho } = req.body;

    // Validate required fields
    if (!id_carrinho) {
      return res.status(400).json({ 
        message: 'ID do carrinho é obrigatório.' 
      });
    }

    // Check if the cart exists
    const cart = await Cart.findByPk(id_carrinho, {
      include: [{
        model: Client,
        as: 'clientInfo'
      }]
    });

    if (!cart) {
      return res.status(404).json({ 
        message: 'Carrinho não encontrado.' 
      });
    }

    // Check if the cart is active
    if (cart.status !== 'ativo') {
      return res.status(403).json({ 
        message: `Não é possível criar pedido a partir de um carrinho ${cart.status}.` 
      });
    }

    // Retrieve cart items
    const cartItems = await CartItem.findAll({
      where: { id_carrinho },
      include: [{
        model: Product,
        as: 'product',
        attributes: PRODUCT_ATTRIBUTES
      }]
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ 
        message: 'O carrinho está vazio. Não é possível criar um pedido.' 
      });
    }

    // Check stock for all products
    for (const item of cartItems) {
      if (item.quantidade > item.product.estoque) {
        return res.status(400).json({ 
          message: `Produto ${item.product.nome} não possui estoque suficiente.` 
        });
      }
    }

    // Create the order
    const order = await Order.create({
      id_cliente: cart.id_cliente,
      status: 'pendente',
      total: 0.00
    }, { transaction });

    // Calculate the total and add items to the order
    let total = 0;
    for (const item of cartItems) {
      const subtotal = parseFloat(item.preco_unit) * item.quantidade;
      total += subtotal;

      // Create the order item
      await OrderItem.create({
        id_pedido: order.id_pedido,
        id_produto: item.id_produto,
        quantidade: item.quantidade,
        preco_unit: item.preco_unit || item.product.preco, // Ensure unit price is set
        subtotal: subtotal
      }, { transaction });

      // Update product stock
      await Product.update({
        estoque: item.product.estoque - item.quantidade
      }, { 
        where: { id_produto: item.id_produto },
        transaction 
      });
    }

    // Update the order total
    await order.update({ total }, { transaction });

    // Update cart status to 'finalizado'
    await cart.update({ status: 'finalizado' }, { transaction });

    // Commit the transaction
    await transaction.commit();

    // Retrieve the created order with all relations
    const createdOrder = await Order.findByPk(order.id_pedido, {
      include: [{
        model: Client,
        as: 'client',  // Changed from 'clientInfo' to 'client'
        attributes: CLIENT_ATTRIBUTES,
        include: [{
          model: Person,
          as: 'personInfo',
          attributes: PERSON_ATTRIBUTES
        }]
      }]
    });

    res.status(201).json({
      message: 'Pedido criado com sucesso a partir do carrinho!',
      data: createdOrder
    });
  } catch (error) {
    // Rollback in case of error
    await transaction.rollback();
    
    res.status(500).json({ 
      message: 'Erro ao criar o pedido a partir do carrinho.', 
      error: error.message 
    });
  }
};

// Retrieve a specific Order
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      attributes: ORDER_ATTRIBUTES,
      include: [
        {
          model: Client,
          as: 'client',
          attributes: CLIENT_ATTRIBUTES,
          include: [{
            model: Person,
            as: 'personInfo',
            attributes: PERSON_ATTRIBUTES
          }]
        },
        {
          model: OrderItem,
          as: 'orderItems', // Changed from 'items' to 'orderItems'
          attributes: ORDERITEM_ATTRIBUTES,
          include: [{
            model: Product,
            as: 'product',
            attributes: PRODUCT_ATTRIBUTES
          }]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ 
        message: 'Pedido não encontrado.' 
      });
    }

    res.status(200).json({
      message: 'Pedido encontrado com sucesso!',
      data: order
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar o pedido.', 
      error: error.message 
    });
  }
};

// List all Orders with pagination
exports.findAll = async (req, res) => {
  try {
    const { page = 1, size = 10, status, id_cliente } = req.query;
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    // Build filter conditions
    const condition = {};
    if (status) condition.status = status;
    if (id_cliente) condition.id_cliente = id_cliente;

    const { count, rows } = await Order.findAndCountAll({
      where: condition,
      attributes: ORDER_ATTRIBUTES,
      limit,
      offset,
      distinct: true,
      include: [{
        model: Client,
        as: 'client', // Changed from 'clientInfo' to 'client'
        attributes: CLIENT_ATTRIBUTES,
        include: [{
          model: Person,
          as: 'personInfo',
          attributes: PERSON_ATTRIBUTES
        }]
      }],
      order: [['criado_em', 'DESC']]
    });

    res.status(200).json({
      message: 'Pedidos listados com sucesso!',
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao listar os pedidos.',
      error: error.message
    });
  }
};

// List all Orders of a client
exports.findAllByClient = async (req, res) => {
  try {
    const { id_cliente } = req.params;
    const { page = 1, size = 10, status } = req.query;
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    // Build filter conditions
    const condition = { id_cliente };
    if (status) condition.status = status;

    const { count, rows } = await Order.findAndCountAll({
      where: condition,
      attributes: ORDER_ATTRIBUTES,
      limit,
      offset,
      distinct: true,
      include: [{
        model: OrderItem,
        as: 'orderItems', // Change from 'items' to 'orderItems' to match the association
        attributes: ORDERITEM_ATTRIBUTES,
        include: [{
          model: Product,
          as: 'product',
          attributes: PRODUCT_ATTRIBUTES
        }]
      }],
      order: [['criado_em', 'DESC']]
    });

    res.status(200).json({
      message: 'Pedidos do cliente listados com sucesso!',
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao listar os pedidos do cliente.', 
      error: error.message 
    });
  }
};

// Update the status of an Order
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate required fields
    if (!status) {
      return res.status(400).json({ 
        message: 'Status é obrigatório.' 
      });
    }

    // Check if the order exists
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ 
        message: 'Pedido não encontrado.' 
      });
    }

    // Validate allowed status transitions
    const validTransitions = {
      'pendente': ['em_processamento', 'cancelado'],
      'em_processamento': ['enviado', 'cancelado'],
      'enviado': ['entregue', 'cancelado'],
      'entregue': [],
      'cancelado': []
    };

    if (!validTransitions[order.status].includes(status)) {
      return res.status(400).json({ 
        message: `Não é possível alterar o status de '${order.status}' para '${status}'.` 
      });
    }

    // If canceling the order, restore stock
    if (status === 'cancelado') {
      const transaction = await db.sequelize.transaction();
      
      try {
        // Retrieve order items
        const orderItems = await OrderItem.findAll({
          where: { id_pedido: id },
          include: [{
            model: Product,
            as: 'product'
          }]
        });

        // Restore stock for each product
        for (const item of orderItems) {
          await Product.update({
            estoque: item.product.estoque + item.quantidade
          }, { 
            where: { id_produto: item.id_produto },
            transaction 
          });
        }

        // Update the order status
        await order.update({ status }, { transaction });
        
        // Commit the transaction
        await transaction.commit();
      } catch (error) {
        // Rollback in case of error
        await transaction.rollback();
        throw error;
      }
    } else {
      // Update only the status
      await order.update({ status });
    }

    // Retrieve the updated order
    const updatedOrder = await Order.findByPk(id, {
      include: [
        {
          model: Client,
          as: 'client',
          attributes: CLIENT_ATTRIBUTES,
          include: [{
            model: Person,
            as: 'personInfo',
            attributes: PERSON_ATTRIBUTES
          }]
        },
        {
          model: OrderItem,
          as: 'orderItems', // Changed from 'items' to 'orderItems'
          attributes: ORDERITEM_ATTRIBUTES,
          include: [{
            model: Product,
            as: 'product',
            attributes: PRODUCT_ATTRIBUTES
          }]
        }
      ]
    });

    res.status(200).json({
      message: 'Status do pedido atualizado com sucesso!',
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao atualizar o status do pedido.', 
      error: error.message 
    });
  }
};

// Delete an Order
exports.delete = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { id } = req.params;

    // Check if the order exists
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ 
        message: 'Pedido não encontrado.' 
      });
    }

    // Check if the order can be deleted (only pending or canceled orders)
    if (!['pendente', 'cancelado'].includes(order.status)) {
      return res.status(403).json({ 
        message: `Não é possível deletar um pedido com status '${order.status}'.` 
      });
    }

    // If the order is pending, restore stock
    if (order.status === 'pendente') {
      // Retrieve order items
      const orderItems = await OrderItem.findAll({
        where: { id_pedido: id },
        include: [{
          model: Product,
          as: 'product'
        }]
      });

      // Restore stock for each product
      for (const item of orderItems) {
        await Product.update({
          estoque: item.product.estoque + item.quantidade
        }, { 
          where: { id_produto: item.id_produto },
          transaction 
        });
      }
    }

    // Delete order items
    await OrderItem.destroy({
      where: { id_pedido: id },
      transaction
    });

    // Delete the order
    await Order.destroy({
      where: { id_pedido: id },
      transaction
    });

    // Commit the transaction
    await transaction.commit();

    res.status(200).json({
      message: 'Pedido deletado com sucesso!'
    });
  } catch (error) {
    // Rollback in case of error
    await transaction.rollback();
    
    res.status(500).json({ 
      message: 'Erro ao deletar o pedido.', 
      error: error.message 
    });
  }
};