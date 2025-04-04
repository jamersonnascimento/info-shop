module.exports = (app) => {
    const clientController = require('../controllers/client.controller');
    const router = require('express').Router();
  
    // Routes for bulk operations
    router.route('/')
        .post(clientController.create)     // Create client (POST /api/clients)
        .get(clientController.findAll)     // List all (GET /api/clients)
        .delete(clientController.deleteAll); // Delete all (DELETE /api/clients) Keeps person records
  
    // Routes for specific operations
    router.route('/:id')
        .get(clientController.findOne)     // Find by ID (GET /api/clients/:id)
        .put(clientController.update)      // Update (PUT /api/clients/:id)
        .delete(clientController.delete);  // Delete (DELETE /api/clients/:id)
  
    // Base prefix for all Client routes
    app.use('/api/clients', router);
};