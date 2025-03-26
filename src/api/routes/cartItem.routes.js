module.exports = (app) => {
  const cartItemController = require('../controllers/cartItem.controller');
  const router = require('express').Router();

  // Rotas para operações em itens de carrinho
  router.route('/')
    .post(cartItemController.create)    // Criar item no carrinho
    .get(cartItemController.findAll);   // Listar todos com paginação

  router.route('/:id')
    .get(cartItemController.findOne)        // Buscar por ID
    .patch(cartItemController.updateQuantity) // Atualizar quantidade
    .delete(cartItemController.delete);     // Deletar

  // Rotas específicas para operações em itens de um carrinho específico
  router.route('/cart/:id_carrinho')
    .get(cartItemController.findAllByCart)     // Listar itens de um carrinho
    .delete(cartItemController.deleteAllByCart); // Deletar todos os itens de um carrinho

  // Prefixo base para todas as rotas de CartItem
  app.use('/api/cart-items', router);
};