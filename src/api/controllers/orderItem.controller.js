// This file contains controller functions for managing order items in the application.
// It includes operations such as creating, retrieving, updating, and deleting order items.

const db = require('../models');
const OrderItem = db.OrderItem;
const Order = db.Order;
const Product = db.Product;
const { Op } = require('sequelize');

// Constants to define the order of attributes for OrderItem and Product
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

// Create a new Item in the Order
exports.create = async (req, res) => {
  try {
    const { id_pedido, id_produto, quantidade, preco_unit } = req.body;

    // Validate required fields
    if (!id_pedido) {
      return res.status(400).json({ 
        message: 'ID do pedido é obrigatório.' 
      });
    }

    if (!id_produto) {
      return res.status(400).json({ 
        message: 'ID do produto é obrigatório.' 
      });
    }

    // Check if the order exists
    const order = await Order.findByPk(id_pedido);
    if (!order) {
      return res.status(404).json({ 
        message: 'Pedido não encontrado.' 
      });
    }

    // Check if the order is in a state that allows adding items
    if (order.status !== 'pendente') {
      return res.status(403).json({ 
        message: `Não é possível adicionar itens a um pedido ${order.status}.` 
      });
    }

    // Check if the product exists
    const product = await Product.findByPk(id_produto);
    if (!product) {
      return res.status(404).json({ 
        message: 'Produto não encontrado.' 
      });
    }

    // Check if the product has sufficient stock
    if (product.estoque < quantidade) {
      return res.status(400).json({ 
        message: 'Quantidade solicitada indisponível em estoque.' 
      });
    }

    // Check if the item already exists in the order
    const existingItem = await OrderItem.findOne({
      where: { 
        id_pedido,
        id_produto 
      }
    });

    let orderItem;
    const transaction = await db.sequelize.transaction();
    
    try {
      // Determine the unit price to be used
      const finalPrice = preco_unit || product.preco;
      const subtotal = parseFloat(finalPrice) * quantidade;
      
      if (existingItem) {
        // Update the quantity if the item already exists
        const newQuantity = existingItem.quantidade + quantidade;
        
        // Check stock again for the new quantity
        if (product.estoque < newQuantity) {
          return res.status(400).json({ 
            message: 'Quantidade solicitada indisponível em estoque.' 
          });
        }
        
        // Calculate the new subtotal
        const newSubtotal = parseFloat(existingItem.preco_unit) * newQuantity;
        
        orderItem = await existingItem.update({ 
          quantidade: newQuantity,
          subtotal: newSubtotal
        }, { transaction });
      } else {
        // Create a new item
        orderItem = await OrderItem.create({ 
          id_pedido,
          id_produto,
          quantidade,
          preco_unit: finalPrice,
          subtotal
        }, { transaction });
      }
      
      // Update the product stock
      await Product.update({
        estoque: product.estoque - quantidade
      }, { 
        where: { id_produto },
        transaction 
      });
      
      // Recalculate the order total
      const orderItems = await OrderItem.findAll({
        where: { id_pedido },
        transaction
      });
      
      const total = orderItems.reduce((sum, item) => {
        return sum + parseFloat(item.subtotal);
      }, 0);
      
      // Update the order total
      await Order.update({ total }, {
        where: { id_pedido },
        transaction
      });
      
      // Commit the transaction
      await transaction.commit();
      
      // Retrieve the created/updated item with all relations
      const result = await OrderItem.findByPk(orderItem.id_item_pedido, {
        include: [{
          model: Product,
          as: 'product',
          attributes: PRODUCT_ATTRIBUTES
        }]
      });
      
      res.status(201).json({
        message: existingItem ? 'Item do pedido atualizado com sucesso!' : 'Item adicionado ao pedido com sucesso!',
        data: result
      });
    } catch (error) {
      // Rollback in case of error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao adicionar item ao pedido.', 
      error: error.message 
    });
  }
};

// Retrieve a specific Item
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const orderItem = await OrderItem.findByPk(id, {
      attributes: ORDERITEM_ATTRIBUTES,
      include: [{
        model: Product,
        as: 'product',
        attributes: PRODUCT_ATTRIBUTES
      }]
    });

    if (!orderItem) {
      return res.status(404).json({ 
        message: 'Item do pedido não encontrado.' 
      });
    }

    res.status(200).json({
      message: 'Item do pedido encontrado com sucesso!',
      data: orderItem
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar o item do pedido.', 
      error: error.message 
    });
  }
};

// List all Items with pagination
exports.findAll = async (req, res) => {
  try {
    const { page = 1, size = 10, id_pedido } = req.query;
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    // Build filter conditions
    const condition = {};
    if (id_pedido) condition.id_pedido = id_pedido;

    const { count, rows } = await OrderItem.findAndCountAll({
      where: condition,
      attributes: ORDERITEM_ATTRIBUTES,
      limit,
      offset,
      distinct: true,
      include: [{
        model: Product,
        as: 'product',
        attributes: PRODUCT_ATTRIBUTES
      }],
      order: [['criado_em', 'DESC']]
    });

    res.status(200).json({
      message: 'Itens listados com sucesso!',
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao listar os itens do pedido.', 
      error: error.message 
    });
  }
};

// List all Items of a specific order
exports.findAllByOrder = async (req, res) => {
  try {
    const { id_pedido } = req.params;
    const { page = 1, size = 10 } = req.query;
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    // Check if the order exists
    const order = await Order.findByPk(id_pedido);
    if (!order) {
      return res.status(404).json({ 
        message: 'Pedido não encontrado.' 
      });
    }

    const { count, rows } = await OrderItem.findAndCountAll({
      where: { id_pedido },
      attributes: ORDERITEM_ATTRIBUTES,
      limit,
      offset,
      distinct: true,
      include: [{
        model: Product,
        as: 'product',
        attributes: PRODUCT_ATTRIBUTES
      }],
      order: [['criado_em', 'ASC']]
    });

    res.status(200).json({
      message: 'Itens do pedido listados com sucesso!',
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao listar os itens do pedido.', 
      error: error.message 
    });
  }
};

// Update the quantity of an Item
exports.updateQuantity = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { quantidade } = req.body;

    // Validate required fields
    if (!quantidade || quantidade <= 0) {
      return res.status(400).json({ 
        message: 'Quantidade deve ser maior que zero.' 
      });
    }

    // Check if the item exists
    const orderItem = await OrderItem.findByPk(id, {
      include: [{
        model: Product,
        as: 'product'
      }]
    });

    if (!orderItem) {
      return res.status(404).json({ 
        message: 'Item do pedido não encontrado.' 
      });
    }

    // Check if the order is in a state that allows updating items
    const order = await Order.findByPk(orderItem.id_pedido);
    if (order.status !== 'pendente') {
      return res.status(403).json({ 
        message: `Não é possível atualizar itens de um pedido ${order.status}.` 
      });
    }

    // Calculate the quantity difference
    const quantityDiff = quantidade - orderItem.quantidade;
    
    // Check stock if increasing the quantity
    if (quantityDiff > 0 && orderItem.product.estoque < quantityDiff) {
      return res.status(400).json({ 
        message: 'Quantidade solicitada indisponível em estoque.' 
      });
    }

    // Calculate the new subtotal
    const subtotal = parseFloat(orderItem.preco_unit) * quantidade;
    
    // Update the item
    await orderItem.update({ 
      quantidade,
      subtotal
    }, { transaction });
    
    // Update the product stock
    await Product.update({
      estoque: orderItem.product.estoque - quantityDiff
    }, { 
      where: { id_produto: orderItem.id_produto },
      transaction 
    });
    
    // Recalculate the order total
    const orderItems = await OrderItem.findAll({
      where: { id_pedido: orderItem.id_pedido },
      transaction
    });
    
    const total = orderItems.reduce((sum, item) => {
      return sum + parseFloat(item.subtotal);
    }, 0);
    
    // Update the order total
    await Order.update({ total }, {
      where: { id_pedido: orderItem.id_pedido },
      transaction
    });
    
    // Commit the transaction
    await transaction.commit();
    
    // Retrieve the updated item
    const updatedItem = await OrderItem.findByPk(id, {
      include: [{
        model: Product,
        as: 'product',
        attributes: PRODUCT_ATTRIBUTES
      }]
    });
    
    res.status(200).json({
      message: 'Quantidade do item atualizada com sucesso!',
      data: updatedItem
    });
  } catch (error) {
    // Rollback in case of error
    await transaction.rollback();
    
    res.status(500).json({ 
      message: 'Erro ao atualizar a quantidade do item.', 
      error: error.message 
    });
  }
};

// Delete an Item
exports.delete = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { id } = req.params;

    // Check if the item exists
    const orderItem = await OrderItem.findByPk(id, {
      include: [{
        model: Product,
        as: 'product'
      }]
    });

    if (!orderItem) {
      return res.status(404).json({ 
        message: 'Item do pedido não encontrado.' 
      });
    }

    // Check if the order is in a state that allows removing items
    const order = await Order.findByPk(orderItem.id_pedido);
    if (order.status !== 'pendente') {
      return res.status(403).json({ 
        message: `Não é possível remover itens de um pedido ${order.status}.` 
      });
    }

    // Restore the product stock
    await Product.update({
      estoque: orderItem.product.estoque + orderItem.quantidade
    }, { 
      where: { id_produto: orderItem.id_produto },
      transaction 
    });
    
    // Remove the item
    await OrderItem.destroy({
      where: { id_item_pedido: id },
      transaction
    });
    
    // Recalculate the order total
    const orderItems = await OrderItem.findAll({
      where: { id_pedido: orderItem.id_pedido },
      transaction
    });
    
    const total = orderItems.reduce((sum, item) => {
      return sum + parseFloat(item.subtotal);
    }, 0);
    
    // Update the order total
    await Order.update({ total }, {
      where: { id_pedido: orderItem.id_pedido },
      transaction
    });
    
    // Commit the transaction
    await transaction.commit();
    
    res.status(200).json({
      message: 'Item removido do pedido com sucesso!'
    });
  } catch (error) {
    // Rollback in case of error
    await transaction.rollback();
    
    res.status(500).json({ 
      message: 'Erro ao remover o item do pedido.', 
      error: error.message 
    });
  }
};

// Delete all Items of an order
exports.deleteAllByOrder = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { id_pedido } = req.params;

    // Check if the order exists
    const order = await Order.findByPk(id_pedido);
    if (!order) {
      return res.status(404).json({ 
        message: 'Pedido não encontrado.' 
      });
    }

    // Check if the order is in a state that allows removing items
    if (order.status !== 'pendente') {
      return res.status(403).json({ 
        message: `Não é possível remover itens de um pedido ${order.status}.` 
      });
    }

    // Retrieve all items of the order
    const orderItems = await OrderItem.findAll({
      where: { id_pedido },
      include: [{
        model: Product,
        as: 'product'
      }]
    });

    // Restore the stock of each product
    for (const item of orderItems) {
      await Product.update({
        estoque: item.product.estoque + item.quantidade
      }, { 
        where: { id_produto: item.id_produto },
        transaction 
      });
    }
    
    // Remove all items
    await OrderItem.destroy({
      where: { id_pedido },
      transaction
    });
    
    // Reset the order total
    await Order.update({ total: 0 }, {
      where: { id_pedido },
      transaction
    });
    
    // Commit the transaction
    await transaction.commit();
    
    res.status(200).json({
      message: 'Todos os itens foram removidos do pedido com sucesso!'
    });
  } catch (error) {
    // Rollback in case of error
    await transaction.rollback();
    
    res.status(500).json({ 
      message: 'Erro ao remover os itens do pedido.', 
      error: error.message 
    });
  }
};