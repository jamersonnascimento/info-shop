module.exports = (app) => {
    const categoryController = require('../controllers/category.controller');
    const router = require('express').Router();
  
    // Rotas para operações em massa
    router.route('/')
        .post(categoryController.create)    // Criar categoria
        .get(categoryController.findAll);   // Listar todas com paginação e filtros
  
    // Rotas para operações específicas
    router.route('/:id')
        .get(categoryController.findOne)    // Buscar por ID
        .put(categoryController.update)     // Atualizar
        .delete(categoryController.delete); // Deletar
  
    // Rotas para gerenciar relação entre categorias e produtos
    router.route('/:categoryId/products')
        .get(categoryController.findProducts)  // Listar produtos de uma categoria
        .post(categoryController.addProduct);  // Adicionar produto a uma categoria
  
    router.route('/:categoryId/products/:productId')
        .delete(categoryController.removeProduct); // Remover produto de uma categoria
  
    // Prefixo base para todas as rotas de Categoria
    app.use('/api/categories', router);
};