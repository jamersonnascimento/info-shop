const db = require('../models');
const OrderItem = db.OrderItem;
const Order = db.Order;
const Product = db.Product;
const { Op } = require('sequelize');

// Constantes para definir ordem dos atributos
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

// Criar um novo Item no Pedido
exports.create = async (req, res) => {
  try {
    const { id_pedido, id_produto, quantidade, preco_unit } = req.body;

    // Validações detalhadas
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

    // Verifica se o pedido existe
    const order = await Order.findByPk(id_pedido);
    if (!order) {
      return res.status(404).json({ 
        message: 'Pedido não encontrado.' 
      });
    }

    // Verifica se o pedido está em um estado que permite adicionar itens
    if (order.status !== 'pendente') {
      return res.status(403).json({ 
        message: `Não é possível adicionar itens a um pedido ${order.status}.` 
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

    // Verifica se o item já existe no pedido
    const existingItem = await OrderItem.findOne({
      where: { 
        id_pedido,
        id_produto 
      }
    });

    let orderItem;
    const transaction = await db.sequelize.transaction();
    
    try {
      // Determina o preço unitário a ser usado
      const finalPrice = preco_unit || product.preco;
      const subtotal = parseFloat(finalPrice) * quantidade;
      
      if (existingItem) {
        // Atualiza a quantidade se o item já existir
        const newQuantity = existingItem.quantidade + quantidade;
        
        // Verifica novamente o estoque para a nova quantidade
        if (product.estoque < newQuantity) {
          return res.status(400).json({ 
            message: 'Quantidade solicitada indisponível em estoque.' 
          });
        }
        
        // Calcula o novo subtotal
        const newSubtotal = parseFloat(existingItem.preco_unit) * newQuantity;
        
        orderItem = await existingItem.update({ 
          quantidade: newQuantity,
          subtotal: newSubtotal
        }, { transaction });
      } else {
        // Cria um novo item
        orderItem = await OrderItem.create({ 
          id_pedido,
          id_produto,
          quantidade,
          preco_unit: finalPrice,
          subtotal
        }, { transaction });
      }
      
      // Atualiza o estoque do produto
      await Product.update({
        estoque: product.estoque - quantidade
      }, { 
        where: { id_produto },
        transaction 
      });
      
      // Recalcula o total do pedido
      const orderItems = await OrderItem.findAll({
        where: { id_pedido },
        transaction
      });
      
      const total = orderItems.reduce((sum, item) => {
        return sum + parseFloat(item.subtotal);
      }, 0);
      
      // Atualiza o total do pedido
      await Order.update({ total }, {
        where: { id_pedido },
        transaction
      });
      
      // Commit da transação
      await transaction.commit();
      
      // Busca o item criado/atualizado com todas as relações
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
      // Rollback em caso de erro
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

// Buscar um Item específico
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

// Listar todos os Itens com paginação
exports.findAll = async (req, res) => {
  try {
    const { page = 1, size = 10, id_pedido } = req.query;
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    // Construir condições de filtro
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

// Listar todos os Itens de um pedido específico
exports.findAllByOrder = async (req, res) => {
  try {
    const { id_pedido } = req.params;
    const { page = 1, size = 10 } = req.query;
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    // Verifica se o pedido existe
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

// Atualizar a quantidade de um Item
exports.updateQuantity = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { quantidade } = req.body;

    // Validações
    if (!quantidade || quantidade <= 0) {
      return res.status(400).json({ 
        message: 'Quantidade deve ser maior que zero.' 
      });
    }

    // Verifica se o item existe
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

    // Verifica se o pedido está em um estado que permite atualizar itens
    const order = await Order.findByPk(orderItem.id_pedido);
    if (order.status !== 'pendente') {
      return res.status(403).json({ 
        message: `Não é possível atualizar itens de um pedido ${order.status}.` 
      });
    }

    // Calcula a diferença de quantidade
    const quantityDiff = quantidade - orderItem.quantidade;
    
    // Verifica estoque se estiver aumentando a quantidade
    if (quantityDiff > 0 && orderItem.product.estoque < quantityDiff) {
      return res.status(400).json({ 
        message: 'Quantidade solicitada indisponível em estoque.' 
      });
    }

    // Calcula o novo subtotal
    const subtotal = parseFloat(orderItem.preco_unit) * quantidade;
    
    // Atualiza o item
    await orderItem.update({ 
      quantidade,
      subtotal
    }, { transaction });
    
    // Atualiza o estoque do produto
    await Product.update({
      estoque: orderItem.product.estoque - quantityDiff
    }, { 
      where: { id_produto: orderItem.id_produto },
      transaction 
    });
    
    // Recalcula o total do pedido
    const orderItems = await OrderItem.findAll({
      where: { id_pedido: orderItem.id_pedido },
      transaction
    });
    
    const total = orderItems.reduce((sum, item) => {
      return sum + parseFloat(item.subtotal);
    }, 0);
    
    // Atualiza o total do pedido
    await Order.update({ total }, {
      where: { id_pedido: orderItem.id_pedido },
      transaction
    });
    
    // Commit da transação
    await transaction.commit();
    
    // Busca o item atualizado
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
    // Rollback em caso de erro
    await transaction.rollback();
    
    res.status(500).json({ 
      message: 'Erro ao atualizar a quantidade do item.', 
      error: error.message 
    });
  }
};

// Deletar um Item
exports.delete = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { id } = req.params;

    // Verifica se o item existe
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

    // Verifica se o pedido está em um estado que permite remover itens
    const order = await Order.findByPk(orderItem.id_pedido);
    if (order.status !== 'pendente') {
      return res.status(403).json({ 
        message: `Não é possível remover itens de um pedido ${order.status}.` 
      });
    }

    // Restaura o estoque do produto
    await Product.update({
      estoque: orderItem.product.estoque + orderItem.quantidade
    }, { 
      where: { id_produto: orderItem.id_produto },
      transaction 
    });
    
    // Remove o item
    await OrderItem.destroy({
      where: { id_item_pedido: id },
      transaction
    });
    
    // Recalcula o total do pedido
    const orderItems = await OrderItem.findAll({
      where: { id_pedido: orderItem.id_pedido },
      transaction
    });
    
    const total = orderItems.reduce((sum, item) => {
      return sum + parseFloat(item.subtotal);
    }, 0);
    
    // Atualiza o total do pedido
    await Order.update({ total }, {
      where: { id_pedido: orderItem.id_pedido },
      transaction
    });
    
    // Commit da transação
    await transaction.commit();
    
    res.status(200).json({
      message: 'Item removido do pedido com sucesso!'
    });
  } catch (error) {
    // Rollback em caso de erro
    await transaction.rollback();
    
    res.status(500).json({ 
      message: 'Erro ao remover o item do pedido.', 
      error: error.message 
    });
  }
};

// Deletar todos os Itens de um pedido
exports.deleteAllByOrder = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { id_pedido } = req.params;

    // Verifica se o pedido existe
    const order = await Order.findByPk(id_pedido);
    if (!order) {
      return res.status(404).json({ 
        message: 'Pedido não encontrado.' 
      });
    }

    // Verifica se o pedido está em um estado que permite remover itens
    if (order.status !== 'pendente') {
      return res.status(403).json({ 
        message: `Não é possível remover itens de um pedido ${order.status}.` 
      });
    }

    // Busca todos os itens do pedido
    const orderItems = await OrderItem.findAll({
      where: { id_pedido },
      include: [{
        model: Product,
        as: 'product'
      }]
    });

    // Restaura o estoque de cada produto
    for (const item of orderItems) {
      await Product.update({
        estoque: item.product.estoque + item.quantidade
      }, { 
        where: { id_produto: item.id_produto },
        transaction 
      });
    }
    
    // Remove todos os itens
    await OrderItem.destroy({
      where: { id_pedido },
      transaction
    });
    
    // Zera o total do pedido
    await Order.update({ total: 0 }, {
      where: { id_pedido },
      transaction
    });
    
    // Commit da transação
    await transaction.commit();
    
    res.status(200).json({
      message: 'Todos os itens foram removidos do pedido com sucesso!'
    });
  } catch (error) {
    // Rollback em caso de erro
    await transaction.rollback();
    
    res.status(500).json({ 
      message: 'Erro ao remover os itens do pedido.', 
      error: error.message 
    });
  }
};