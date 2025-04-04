module.exports = (app) => {
    const addressController = require('../controllers/address.controller');
    const router = require('express').Router();
  
    // Routes for bulk operations
    router.route('/')
        .post(addressController.create)    // Create address
        .get(addressController.findAll);   // List all with pagination

    // Routes for specific operations
    router.route('/:id')
        .get(addressController.findOne)    // Find by ID
        .put(addressController.update)     // Update
        .delete(addressController.delete); // Delete

    // Route to find addresses by client
    router.route('/client/:id_cliente')
        .get(addressController.findAllByClient); // List addresses of a client
  
    // Base prefix for all Address routes
    app.use('/api/addresses', router);
};