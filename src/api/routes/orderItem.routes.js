module.exports = (app) => {
  const orderItemController = require('../controllers/orderItem.controller');
  const router = require('express').Router();

  // Routes for order item operations
  router.route('/')
    .post(orderItemController.create)    // Create order item
    .get(orderItemController.findAll);   // List all with pagination

  router.route('/:id')
    .get(orderItemController.findOne)        // Find by ID
    .patch(orderItemController.updateQuantity) // Update quantity
    .delete(orderItemController.delete);     // Delete

  // Specific routes for operations on items of a specific order
  router.route('/order/:id_pedido')
    .get(orderItemController.findAllByOrder)     // List items of an order
    .delete(orderItemController.deleteAllByOrder); // Delete all items of an order

  // Base prefix for all OrderItem routes
  app.use('/api/order-items', router);
};