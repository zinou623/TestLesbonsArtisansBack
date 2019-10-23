const Produit = require('../models/produit.model.js');
// in the first time load data from Products.json to database

const fs = require('fs');
const produitData = fs.readFileSync('Products.json');
let produits = JSON.parse(produitData);
produits = produits.map((p) => ({
  name: p.name,
  type: p.type,
  price: p.price,
  rating: p.rating,
  warranty_years: p.warranty_years,
  available: p.available,
}));
Produit.insertMany(produits);

// Create and Save a new Produit
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    return res.status(400).send({
      message: 'Produit content can not be empty',
    });
  }

  // Create a Produit
  const produit = new Produit({
    name: req.body.name,
    type: req.body.type,
    price: req.body.price,
    rating: req.body.rating,
    warranty_years: req.body.warranty_years,
    available: req.body.available,

  });

  // Save Produit in the database
  produit.save()
      .then((data) => {
        res.send(data);
      }).catch((err) => {
        res.status(500).send({
          message: err.message ||
          'Some error occurred while creating the Produit.',
        });
      });
};
// Retrieve and return all Produits from the database.
exports.findAll = (req, res) => {
  Produit.find()
      .then((Produits) => {
        res.send(Produits);
      }).catch((err) => {
        res.status(500).send({
          message: err.message ||
          'Some error occurred while retrieving Produits.',
        });
      });
};
// Find a single Produit with a produitId
exports.findOne = (req, res) => {
  Produit.findById(req.params.produitId)
      .then((Produit) => {
        if (!Produit) {
          return res.status(404).send({
            message: 'Produit not found with id ' + req.params.produitId,
          });
        }
        res.send(Produit);
      }).catch((err) => {
        if (err.kind === 'ObjectId') {
          return res.status(404).send({
            message: 'Produit not found with id ' + req.params.produitId,
          });
        }
        return res.status(500).send({
          message: 'Error retrieving Produit with id ' + req.params.produitId,
        });
      });
};
// Update a Produit identified by the produitId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    return res.status(400).send({
      message: 'Produit content can not be empty',
    });
  }

  // Find Produit and update it with the request body
  Produit.findByIdAndUpdate(req.params.produitId,
      req.body
      , {new: true})
      .then((Produit) => {
        if (!Produit) {
          return res.status(404).send({
            message: 'Produit not found with id ' + req.params.produitId,
          });
        }
        res.send(Produit);
      }).catch((err) => {
        if (err.kind === 'ObjectId') {
          return res.status(404).send({
            message: 'Produit not found with id ' + req.params.produitId,
          });
        }
        return res.status(500).send({
          message: 'Error updating Produit with id ' + req.params.produitId,
        });
      });
};
// Delete a Produit with the specified produitId in the request
exports.delete = (req, res) => {
  Produit.findByIdAndRemove(req.params.produitId)
      .then((Produit) => {
        if (!Produit) {
          return res.status(404).send({
            message: 'Produit not found with id ' + req.params.produitId,
          });
        }
        res.send({message: 'Produit deleted successfully!'});
      }).catch((err) => {
        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
            message: 'Produit not found with id ' + req.params.produitId,
          });
        }
        return res.status(500).send({
          message: 'Could not delete Produit with id ' + req.params.produitId,
        });
      });
};
