module.exports = (app) => {
    const productController = require('../controllers/product.controller');
    const router = require('express').Router();
  
    // Rotas para operações em massa
    router.route('/')
        .post(productController.create)    // Criar produto
        .get(productController.findAll);   // Listar todos com paginação e filtros
  
    // Rotas para operações específicas
    router.route('/:id')
        .get(productController.findOne)    // Buscar por ID
        .put(productController.update)     // Atualizar
        .delete(productController.delete); // Deletar
  
    // Prefixo base para todas as rotas de Produto
    app.use('/api/products', router);
};