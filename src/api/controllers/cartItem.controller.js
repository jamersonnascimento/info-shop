// This file contains controller functions for managing cart items in the application.
// It includes operations such as creating, retrieving, updating, and deleting cart items.

const db = require('../models');
const CartItem = db.CartItem;
const Cart = db.Cart;
const Product = db.Product;
const { Op } = require('sequelize');

// Constants to define the order of attributes for CartItem and Product
const CARTITEM_ATTRIBUTES = [
  'id_item',
  'id_carrinho',
  'id_produto',
  'quantidade',
  'preco_unit',
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

// Create a new Item in the Cart
exports.create = async (req, res) => {
  try {
    const { id_carrinho, id_produto, quantidade, preco_unit } = req.body;

    // Validate required fields
    if (!id_carrinho) {
      return res.status(400).json({ 
        message: 'ID do carrinho é obrigatório.' 
      });
    }

    if (!id_produto) {
      return res.status(400).json({ 
        message: 'ID do produto é obrigatório.' 
      });
    }

    // Check if the cart exists
    const cart = await Cart.findByPk(id_carrinho);
    if (!cart) {
      return res.status(404).json({ 
        message: 'Carrinho não encontrado.' 
      });
    }

    // Check if the cart is active
    if (cart.status !== 'ativo') {
      return res.status(403).json({ 
        message: `Não é possível adicionar itens a um carrinho ${cart.status}.` 
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

    // Check if the item already exists in the cart
    const existingItem = await CartItem.findOne({
      where: { 
        id_carrinho,
        id_produto 
      }
    });

    let cartItem;
    
    if (existingItem) {
      // Update the quantity if the item already exists
      const newQuantity = existingItem.quantidade + quantidade;
      
      // Check stock again for the new quantity
      if (product.estoque < newQuantity) {
        return res.status(400).json({ 
          message: 'Quantidade solicitada indisponível em estoque.' 
        });
      }
      
      cartItem = await existingItem.update({ 
        quantidade: newQuantity,
        // Update the unit price if provided, otherwise keep the current
        preco_unit: preco_unit || existingItem.preco_unit
      });
      
      return res.status(200).json({
        message: 'Quantidade do item atualizada no carrinho!',
        data: cartItem
      });
    } else {
      // Create a new item in the cart
      cartItem = await CartItem.create({ 
        id_carrinho,
        id_produto,
        quantidade: quantidade || 1,
        preco_unit: preco_unit || product.preco
      });
      
      // Retrieve the created item with all relations
      const createdItem = await CartItem.findByPk(cartItem.id_item, {
        include: [{
          model: Product,
          as: 'product',
          attributes: PRODUCT_ATTRIBUTES
        }]
      });

      return res.status(201).json({
        message: 'Item adicionado ao carrinho com sucesso!',
        data: createdItem
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao adicionar item ao carrinho.', 
      error: error.message 
    });
  }
};

// Retrieve a specific Item
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await CartItem.findByPk(id, {
      include: [{
        model: Product,
        as: 'product',
        attributes: PRODUCT_ATTRIBUTES
      }]
    });

    if (!cartItem) {
      return res.status(404).json({ 
        message: 'Item não encontrado no carrinho.' 
      });
    }

    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar o item do carrinho.', 
      error: error.message 
    });
  }
};

// Retrieve all Items from a Cart
exports.findAllByCart = async (req, res) => {
  try {
    const { id_carrinho } = req.params;
    
    // Check if the cart exists
    const cart = await Cart.findByPk(id_carrinho);
    if (!cart) {
      return res.status(404).json({ 
        message: 'Carrinho não encontrado.' 
      });
    }

    const cartItems = await CartItem.findAll({
      where: { id_carrinho },
      attributes: CARTITEM_ATTRIBUTES,
      include: [{
        model: Product,
        as: 'product',
        attributes: PRODUCT_ATTRIBUTES
      }],
      order: [['criado_em', 'ASC']]
    });

    res.status(200).json({
      total: cartItems.length,
      data: cartItems
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao buscar os itens do carrinho.', 
      error: error.message 
    });
  }
};

// Retrieve all Items with pagination
exports.findAll = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'criado_em', 
      order = 'DESC' 
    } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows } = await CartItem.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, order]],
      include: [{
        model: Product,
        as: 'product',
        attributes: PRODUCT_ATTRIBUTES
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
      message: 'Erro ao buscar os itens de carrinho.', 
      error: error.message 
    });
  }
};

// Update quantity of an Item
exports.updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantidade } = req.body;

    if (!quantidade || quantidade < 1) {
      return res.status(400).json({ 
        message: 'Quantidade deve ser um número positivo.' 
      });
    }

    const cartItem = await CartItem.findByPk(id, {
      include: [{
        model: Product,
        as: 'product'
      }]
    });

    if (!cartItem) {
      return res.status(404).json({ 
        message: 'Item não encontrado no carrinho.' 
      });
    }

    // Check if the cart is active
    const cart = await Cart.findByPk(cartItem.id_carrinho);
    if (cart.status !== 'ativo') {
      return res.status(403).json({ 
        message: `Não é possível atualizar itens de um carrinho ${cart.status}.` 
      });
    }

    // Check if the product has sufficient stock
    if (cartItem.product.estoque < quantidade) {
      return res.status(400).json({ 
        message: 'Quantidade solicitada indisponível em estoque.' 
      });
    }

    await cartItem.update({ quantidade });

    const updatedItem = await CartItem.findByPk(id, {
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
    res.status(500).json({ 
      message: 'Erro ao atualizar a quantidade do item.', 
      error: error.message 
    });
  }
};

// Delete an Item from the Cart
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await CartItem.findByPk(id);
    if (!cartItem) {
      return res.status(404).json({ 
        message: 'Item não encontrado no carrinho.' 
      });
    }

    // Check if the cart is active
    const cart = await Cart.findByPk(cartItem.id_carrinho);
    if (cart.status !== 'ativo') {
      return res.status(403).json({ 
        message: `Não é possível remover itens de um carrinho ${cart.status}.` 
      });
    }

    await cartItem.destroy();

    res.status(200).json({ 
      message: 'Item removido do carrinho com sucesso.',
      data: { id }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao remover o item do carrinho.', 
      error: error.message 
    });
  }
};

// Delete all Items from a Cart
exports.deleteAllByCart = async (req, res) => {
  try {
    const { id_carrinho } = req.params;

    // Check if the cart exists
    const cart = await Cart.findByPk(id_carrinho);
    if (!cart) {
      return res.status(404).json({ 
        message: 'Carrinho não encontrado.' 
      });
    }

    // Check if the cart is active
    if (cart.status !== 'ativo') {
      return res.status(403).json({ 
        message: `Não é possível remover itens de um carrinho ${cart.status}.` 
      });
    }

    const result = await CartItem.destroy({
      where: { id_carrinho }
    });

    res.status(200).json({ 
      message: 'Todos os itens foram removidos do carrinho.',
      data: { count: result }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao remover os itens do carrinho.', 
      error: error.message 
    });
  }
};