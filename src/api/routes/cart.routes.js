module.exports = (app) => {
    const cartController = require('../controllers/cart.controller');
    const router = require('express').Router();
  
    // Routes for bulk operations
    router.route('/')
        .post(cartController.create)    // Create cart
        .get(cartController.findAll);   // List all with pagination
  
    // Routes for specific operations
    router.route('/:id')
        .get(cartController.findOne)       // Find by ID
        .patch(cartController.updateStatus) // Update status
        .delete(cartController.delete);    // Delete
  
    // Base prefix for all Cart routes
    app.use('/api/carts', router);
};