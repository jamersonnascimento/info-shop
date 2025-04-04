module.exports = (app) => {
    const productController = require('../controllers/product.controller');
    const router = require('express').Router();
  
    // Routes for bulk operations
    router.route('/')
        .post(productController.create)    // Create product
        .get(productController.findAll);   // List all with pagination and filters
  
    // Routes for specific operations
    router.route('/:id')
        .get(productController.findOne)    // Find by ID
        .put(productController.update)     // Update
        .delete(productController.delete); // Delete
  
    // Base prefix for all Product routes
    app.use('/api/products', router);
};