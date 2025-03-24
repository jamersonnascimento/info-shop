module.exports = (app) => {
    const personController = require('../controllers/person.controller');
    const router = require('express').Router();
  
    // Rotas para operações em massa
    router.route('/')
        .post(personController.create)    // Criar pessoa
        .get(personController.findAll)   // Listar todas
        .delete(personController.deleteAll); // Deletar todas (apenas em desenvolvimento)
  
    // Rotas para operações específicas
    router.route('/:id')
        .get(personController.findOne)    // Buscar por ID
        .put(personController.update)     // Atualizar
        .delete(personController.delete); // Deletar
  
    // Prefixo base para todas as rotas de Pessoa (no plural)
    app.use('/api/persons', router);
};