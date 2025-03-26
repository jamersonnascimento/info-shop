module.exports = (app) => {
  const orderItemController = require('../controllers/orderItem.controller');
  const router = require('express').Router();

  // Rotas para operações em itens de pedido
  router.route('/')
    .post(orderItemController.create)    // Criar item no pedido
    .get(orderItemController.findAll);   // Listar todos com paginação

  router.route('/:id')
    .get(orderItemController.findOne)        // Buscar por ID
    .patch(orderItemController.updateQuantity) // Atualizar quantidade
    .delete(orderItemController.delete);     // Deletar

  // Rotas específicas para operações em itens de um pedido específico
  router.route('/order/:id_pedido')
    .get(orderItemController.findAllByOrder)     // Listar itens de um pedido
    .delete(orderItemController.deleteAllByOrder); // Deletar todos os itens de um pedido

  // Prefixo base para todas as rotas de OrderItem
  app.use('/api/order-items', router);
};