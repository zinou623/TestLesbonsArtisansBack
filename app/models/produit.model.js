const mongoose = require('mongoose');
const produitSchema = mongoose.Schema({
  name: {unique: true, type: String},
  type: String,
  price: Number,
  rating: Number,
  warranty_years: Number,
  available: Boolean,

});

module.exports = mongoose.model('Produit', produitSchema);
