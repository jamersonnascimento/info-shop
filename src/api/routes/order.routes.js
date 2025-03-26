module.exports = (app) => {
  const orderController = require('../controllers/order.controller');
  const router = require('express').Router();

  // Rotas para operações em massa
  router.route('/')
    .post(orderController.create)    // Criar pedido
    .get(orderController.findAll);   // Listar todos com paginação

  // Rota para criar pedido a partir de carrinho
  router.route('/from-cart')
    .post(orderController.createFromCart); // Criar pedido a partir de carrinho

  // Rotas para operações específicas
  router.route('/:id')
    .get(orderController.findOne)       // Buscar por ID
    .patch(orderController.updateStatus) // Atualizar status
    .delete(orderController.delete);    // Deletar

  // Rotas para listar pedidos de um cliente específico
  router.route('/client/:id_cliente')
    .get(orderController.findAllByClient); // Listar pedidos de um cliente

  // Prefixo base para todas as rotas de Pedido
  app.use('/api/orders', router);
};