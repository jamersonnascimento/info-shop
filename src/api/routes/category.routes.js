module.exports = (app) => {
    const categoryController = require('../controllers/category.controller');
    const router = require('express').Router();
  
    // Routes for bulk operations
    router.route('/')
        .post(categoryController.create)    // Create category
        .get(categoryController.findAll);   // List all with pagination and filters
  
    // Routes for specific operations
    router.route('/:id')
        .get(categoryController.findOne)    // Find by ID
        .put(categoryController.update)     // Update
        .delete(categoryController.delete); // Delete
  
    // Routes to manage the relationship between categories and products
    router.route('/:categoryId/products')
        .get(categoryController.findProducts)  // List products of a category
        .post(categoryController.addProduct);  // Add product to a category
  
    router.route('/:categoryId/products/:productId')
        .delete(categoryController.removeProduct); // Remove product from a category
  
    // Base prefix for all Category routes
    app.use('/api/categories', router);
};