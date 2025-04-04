// payment.routes.js
module.exports = app => {
  const paymentController = require('../controllers/payment.controller');
  const router = require('express').Router();

  // Create a new payment
  router.post('/', paymentController.create);

  // Retrieve all payments with pagination and filters
  router.get('/', paymentController.findAll);

  // Retrieve a specific payment by ID
  router.get('/:id', paymentController.findOne);

  // Update the status of a payment
  router.put('/:id', paymentController.update);

  // Delete a payment (with status validation)
  router.delete('/:id', paymentController.delete);

  // Base prefix for all Payment routes
  app.use('/api/payments', router);
};