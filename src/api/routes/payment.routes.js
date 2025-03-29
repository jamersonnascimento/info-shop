module.exports = app => {
  const paymentController = require('../controllers/payment.controller');
  const router = require('express').Router();

  // Criar um novo pagamento
  router.post('/', paymentController.create);

  // Buscar todos os pagamentos com paginação e filtros
  router.get('/', paymentController.findAll);

  // Buscar um pagamento específico por ID
  router.get('/:id', paymentController.findOne);

  // Atualizar status de um pagamento
  router.put('/:id', paymentController.update);

  // Deletar um pagamento (com validação de status)
  router.delete('/:id', paymentController.delete);

  app.use('/api/payments', router);
};