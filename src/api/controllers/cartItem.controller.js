const db = require('../models');
const CartItem = db.CartItem;
const Cart = db.Cart;
const Product = db.Product;
const { Op } = require('sequelize');

// Constantes para definir ordem dos atributos
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

// Criar um novo Item no Carrinho
exports.create = async (req, res) => {
  try {
    const { id_carrinho, id_produto, quantidade, preco_unit } = req.body;

    // Validações detalhadas
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

    // Verifica se o carrinho existe
    const cart = await Cart.findByPk(id_carrinho);
    if (!cart) {
      return res.status(404).json({ 
        message: 'Carrinho não encontrado.' 
      });
    }

    // Verifica se o carrinho está ativo
    if (cart.status !== 'ativo') {
      return res.status(403).json({ 
        message: `Não é possível adicionar itens a um carrinho ${cart.status}.` 
      });
    }

    // Verifica se o produto existe
    const product = await Product.findByPk(id_produto);
    if (!product) {
      return res.status(404).json({ 
        message: 'Produto não encontrado.' 
      });
    }

    // Verifica se o produto tem estoque suficiente
    if (product.estoque < quantidade) {
      return res.status(400).json({ 
        message: 'Quantidade solicitada indisponível em estoque.' 
      });
    }

    // Verifica se o item já existe no carrinho
    const existingItem = await CartItem.findOne({
      where: { 
        id_carrinho,
        id_produto 
      }
    });

    let cartItem;
    
    if (existingItem) {
      // Atualiza a quantidade se o item já existir
      const newQuantity = existingItem.quantidade + quantidade;
      
      // Verifica novamente o estoque para a nova quantidade
      if (product.estoque < newQuantity) {
        return res.status(400).json({ 
          message: 'Quantidade solicitada indisponível em estoque.' 
        });
      }
      
      cartItem = await existingItem.update({ 
        quantidade: newQuantity,
        // Atualiza o preço unitário se fornecido, senão mantém o atual
        preco_unit: preco_unit || existingItem.preco_unit
      });
      
      return res.status(200).json({
        message: 'Quantidade do item atualizada no carrinho!',
        data: cartItem
      });
    } else {
      // Cria um novo item no carrinho
      cartItem = await CartItem.create({ 
        id_carrinho,
        id_produto,
        quantidade: quantidade || 1,
        preco_unit: preco_unit || product.preco
      });
      
      // Busca o item criado com todas as relações
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

// Buscar um Item específico
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

// Buscar todos os Itens de um Carrinho
exports.findAllByCart = async (req, res) => {
  try {
    const { id_carrinho } = req.params;
    
    // Verifica se o carrinho existe
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

// Buscar todos os Itens com paginação
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

// Atualizar quantidade de um Item
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

    // Verifica se o carrinho está ativo
    const cart = await Cart.findByPk(cartItem.id_carrinho);
    if (cart.status !== 'ativo') {
      return res.status(403).json({ 
        message: `Não é possível atualizar itens de um carrinho ${cart.status}.` 
      });
    }

    // Verifica se o produto tem estoque suficiente
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

// Deletar um Item do Carrinho
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await CartItem.findByPk(id);
    if (!cartItem) {
      return res.status(404).json({ 
        message: 'Item não encontrado no carrinho.' 
      });
    }

    // Verifica se o carrinho está ativo
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

// Deletar todos os Itens de um Carrinho
exports.deleteAllByCart = async (req, res) => {
  try {
    const { id_carrinho } = req.params;

    // Verifica se o carrinho existe
    const cart = await Cart.findByPk(id_carrinho);
    if (!cart) {
      return res.status(404).json({ 
        message: 'Carrinho não encontrado.' 
      });
    }

    // Verifica se o carrinho está ativo
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