module.exports = (app) => {
  const orderController = require('../controllers/order.controller');
  const router = require('express').Router();

  // Routes for bulk operations
  router.route('/')
    .post(orderController.create)    // Create order
    .get(orderController.findAll);   // List all with pagination

  // Route to create order from cart
  router.route('/from-cart')
    .post(orderController.createFromCart); // Create order from cart

  // Routes for specific operations
  router.route('/:id')
    .get(orderController.findOne)       // Find by ID
    .patch(orderController.updateStatus) // Update status
    .delete(orderController.delete);    // Delete

  // Routes to list orders of a specific client
  router.route('/client/:id_cliente')
    .get(orderController.findAllByClient); // List orders of a client

  // Base prefix for all Order routes
  app.use('/api/orders', router);
};