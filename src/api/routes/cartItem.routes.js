module.exports = (app) => {
  const cartItemController = require('../controllers/cartItem.controller');
  const router = require('express').Router();

  // Routes for cart item operations
  router.route('/')
    .post(cartItemController.create)    // Create cart item
    .get(cartItemController.findAll);   // List all with pagination

  router.route('/:id')
    .get(cartItemController.findOne)        // Find by ID
    .patch(cartItemController.updateQuantity) // Update quantity
    .delete(cartItemController.delete);     // Delete

  // Specific routes for operations on items of a specific cart
  router.route('/cart/:id_carrinho')
    .get(cartItemController.findAllByCart)     // List items of a cart
    .delete(cartItemController.deleteAllByCart); // Delete all items of a cart

  // Base prefix for all CartItem routes
  app.use('/api/cart-items', router);
};