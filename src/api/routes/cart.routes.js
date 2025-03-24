module.exports = (app) => {
    const cartController = require('../controllers/cart.controller');
    const router = require('express').Router();
  
    // Rotas para operações em massa
    router.route('/')
        .post(cartController.create)    // Criar carrinho
        .get(cartController.findAll);   // Listar todos com paginação
  
    // Rotas para operações específicas
    router.route('/:id')
        .get(cartController.findOne)       // Buscar por ID
        .patch(cartController.updateStatus) // Atualizar status
        .delete(cartController.delete);    // Deletar
  
    // Prefixo base para todas as rotas de Carrinho
    app.use('/api/carts', router);
};