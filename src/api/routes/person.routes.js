module.exports = (app) => {
    const personController = require('../controllers/person.controller');
    const router = require('express').Router();
  
    // Routes for bulk operations
    router.route('/')
        .post(personController.create)    // Create person
        .get(personController.findAll)   // List all
        .delete(personController.deleteAll); // Delete all (development only)
  
    // Routes for specific operations
    router.route('/:id')
        .get(personController.findOne)    // Find by ID
        .put(personController.update)     // Update
        .delete(personController.delete); // Delete
  
    // Base prefix for all Person routes (in plural)
    app.use('/api/persons', router);
};