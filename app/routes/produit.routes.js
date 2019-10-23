module.exports = (app) => {
  const produits = require('../controllers/produit.controller.js');

  // Create a new produit
  app.post('/produits', produits.create);

  // Retrieve all produits
  app.get('/produits', produits.findAll);
  // // Retrieve all produits
  // app.get('/produits', produits.findAll)

  // Retrieve a single produit with produitId
  app.get('/produits/:produitId', produits.findOne);

  // Update a produit with produitId
  app.put('/produits/:produitId', produits.update);

  // Delete a produit with produitId
  app.delete('/produits/:produitId', produits.delete);
};
