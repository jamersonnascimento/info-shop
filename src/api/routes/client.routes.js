module.exports = (app) => {
    const clientController = require('../controllers/client.controller');
    const router = require('express').Router();
  
    // Rotas para operações em massa
    router.route('/')
        .post(clientController.create)     // Criar cliente (POST /api/clients)
        .get(clientController.findAll)     // Listar todos (GET /api/clients)
        .delete(clientController.deleteAll); // Deletar todos (DELETE /api/clients) Mantém os registros de pessoas
  
    // Rotas para operações específicas
    router.route('/:id')
        .get(clientController.findOne)     // Buscar por ID (GET /api/clients/:id)
        .put(clientController.update)      // Atualizar (PUT /api/clients/:id)
        .delete(clientController.delete);  // Deletar (DELETE /api/clients/:id)
  
    // Prefixo base para todas as rotas de Cliente
    app.use('/api/clients', router);
};