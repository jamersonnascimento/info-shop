module.exports = (app) => {
    const addressController = require('../controllers/address.controller');
    const router = require('express').Router();
  
    // Rotas para operações em massa
    router.route('/')
        .post(addressController.create)    // Criar endereço
        .get(addressController.findAll);   // Listar todos com paginação

    // Rotas para operações específicas
    router.route('/:id')
        .get(addressController.findOne)    // Buscar por ID
        .put(addressController.update)     // Atualizar
        .delete(addressController.delete); // Deletar

    // Rota para buscar endereços por cliente
    router.route('/client/:id_cliente')
        .get(addressController.findAllByClient); // Listar endereços de um cliente
  
    // Prefixo base para todas as rotas de Endereço
    app.use('/api/addresses', router);
};