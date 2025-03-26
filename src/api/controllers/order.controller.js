const db = require('../models');
const Order = db.Order;
const OrderItem = db.OrderItem;
const Client = db.Client;
const Person = db.Person;
const Product = db.Product;
const Cart = db.Cart;
const CartItem = db.CartItem;
const { Op } = require('sequelize');

// Constantes para definir ordem dos atributos
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

// Criar um novo Pedido
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

    // Criação do Pedido
    const order = await Order.create({ 
      id_cliente,
      status: 'pendente',
      total: 0.00
    });

    // Retorna apenas o pedido criado sem incluir relações
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

// Criar um pedido a partir de um carrinho
exports.createFromCart = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { id_carrinho } = req.body;

    // Validações detalhadas
    if (!id_carrinho) {
      return res.status(400).json({ 
        message: 'ID do carrinho é obrigatório.' 
      });
    }

    // Verifica se o carrinho existe
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

    // Verifica se o carrinho está ativo
    if (cart.status !== 'ativo') {
      return res.status(403).json({ 
        message: `Não é possível criar pedido a partir de um carrinho ${cart.status}.` 
      });
    }

    // Busca os itens do carrinho
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

    // Verifica estoque de todos os produtos
    for (const item of cartItems) {
      if (item.quantidade > item.product.estoque) {
        return res.status(400).json({ 
          message: `Produto ${item.product.nome} não possui estoque suficiente.` 
        });
      }
    }

    // Cria o pedido
    const order = await Order.create({
      id_cliente: cart.id_cliente,
      status: 'pendente',
      total: 0.00
    }, { transaction });

    // Calcula o total e adiciona os itens ao pedido
    let total = 0;
    for (const item of cartItems) {
      const subtotal = parseFloat(item.preco_unit) * item.quantidade;
      total += subtotal;

      // Cria o item do pedido
      await OrderItem.create({
        id_pedido: order.id_pedido,
        id_produto: item.id_produto,
        quantidade: item.quantidade,
        preco_unit: item.preco_unit || item.product.preco, // Garante que o preço unitário seja definido
        subtotal: subtotal
      }, { transaction });

      // Atualiza o estoque do produto
      await Product.update({
        estoque: item.product.estoque - item.quantidade
      }, { 
        where: { id_produto: item.id_produto },
        transaction 
      });
    }

    // Atualiza o total do pedido
    await order.update({ total }, { transaction });

    // Atualiza o status do carrinho para 'finalizado'
    await cart.update({ status: 'finalizado' }, { transaction });

    // Commit da transação
    await transaction.commit();

    // Busca o pedido criado com todas as relações
    const createdOrder = await Order.findByPk(order.id_pedido, {
      include: [{
        model: Client,
        as: 'client',  // Alterado de 'clientInfo' para 'client'
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
    // Rollback em caso de erro
    await transaction.rollback();
    
    res.status(500).json({ 
      message: 'Erro ao criar o pedido a partir do carrinho.', 
      error: error.message 
    });
  }
};

// Buscar um Pedido específico
exports.findOne = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id, {
      attributes: ORDER_ATTRIBUTES,
      include: [
        {
          model: Client,
          as: 'client', // Alterado de 'clientInfo' para 'client'
          attributes: CLIENT_ATTRIBUTES,
          include: [{
            model: Person,
            as: 'personInfo',
            attributes: PERSON_ATTRIBUTES
          }]
        },
        {
          model: OrderItem,
          as: 'items',
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

// Listar todos os Pedidos com paginação
exports.findAll = async (req, res) => {
  try {
    const { page = 1, size = 10, status, id_cliente } = req.query;
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    // Construir condições de filtro
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
        as: 'client', // Alterado de 'clientInfo' para 'client'
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

// Listar todos os Pedidos de um cliente
exports.findAllByClient = async (req, res) => {
  try {
    const { id_cliente } = req.params;
    const { page = 1, size = 10, status } = req.query;
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    // Construir condições de filtro
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
        as: 'items',
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

// Atualizar o status de um Pedido
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validações
    if (!status) {
      return res.status(400).json({ 
        message: 'Status é obrigatório.' 
      });
    }

    // Verifica se o pedido existe
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ 
        message: 'Pedido não encontrado.' 
      });
    }

    // Validar transições de status permitidas
    const validTransitions = {
      'pendente': ['em processamento', 'cancelado'],
      'em processamento': ['enviado', 'cancelado'],
      'enviado': ['entregue', 'cancelado'],
      'entregue': [],
      'cancelado': []
    };

    if (!validTransitions[order.status].includes(status)) {
      return res.status(400).json({ 
        message: `Não é possível alterar o status de '${order.status}' para '${status}'.` 
      });
    }

    // Se estiver cancelando o pedido, restaurar o estoque
    if (status === 'cancelado') {
      const transaction = await db.sequelize.transaction();
      
      try {
        // Buscar os itens do pedido
        const orderItems = await OrderItem.findAll({
          where: { id_pedido: id },
          include: [{
            model: Product,
            as: 'product'
          }]
        });

        // Restaurar o estoque de cada produto
        for (const item of orderItems) {
          await Product.update({
            estoque: item.product.estoque + item.quantidade
          }, { 
            where: { id_produto: item.id_produto },
            transaction 
          });
        }

        // Atualizar o status do pedido
        await order.update({ status }, { transaction });
        
        // Commit da transação
        await transaction.commit();
      } catch (error) {
        // Rollback em caso de erro
        await transaction.rollback();
        throw error;
      }
    } else {
      // Atualizar apenas o status
      await order.update({ status });
    }

    // Buscar o pedido atualizado
    const updatedOrder = await Order.findByPk(id, {
      include: [
        {
          model: Client,
          as: 'client', // Alterado de 'clientInfo' para 'client'
          attributes: CLIENT_ATTRIBUTES,
          include: [{
            model: Person,
            as: 'personInfo',
            attributes: PERSON_ATTRIBUTES
          }]
        },
        {
          model: OrderItem,
          as: 'items',
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

// Deletar um Pedido
exports.delete = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const { id } = req.params;

    // Verifica se o pedido existe
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ 
        message: 'Pedido não encontrado.' 
      });
    }

    // Verifica se o pedido pode ser deletado (apenas pedidos pendentes ou cancelados)
    if (!['pendente', 'cancelado'].includes(order.status)) {
      return res.status(403).json({ 
        message: `Não é possível deletar um pedido com status '${order.status}'.` 
      });
    }

    // Se o pedido estiver pendente, restaurar o estoque
    if (order.status === 'pendente') {
      // Buscar os itens do pedido
      const orderItems = await OrderItem.findAll({
        where: { id_pedido: id },
        include: [{
          model: Product,
          as: 'product'
        }]
      });

      // Restaurar o estoque de cada produto
      for (const item of orderItems) {
        await Product.update({
          estoque: item.product.estoque + item.quantidade
        }, { 
          where: { id_produto: item.id_produto },
          transaction 
        });
      }
    }

    // Deletar os itens do pedido
    await OrderItem.destroy({
      where: { id_pedido: id },
      transaction
    });

    // Deletar o pedido
    await Order.destroy({
      where: { id_pedido: id },
      transaction
    });

    // Commit da transação
    await transaction.commit();

    res.status(200).json({
      message: 'Pedido deletado com sucesso!'
    });
  } catch (error) {
    // Rollback em caso de erro
    await transaction.rollback();
    
    res.status(500).json({ 
      message: 'Erro ao deletar o pedido.', 
      error: error.message 
    });
  }
};