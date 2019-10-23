const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketServer = require('socket.io');
// create express app
const app = express();
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods',
      'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers',
      'Content-Type, Authorization,Content-Length, X-Requested-With');
  // allow preflight
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

// parse requests of content-type - application/json
app.use(bodyParser.json());
// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true,
}).then(() => {
  console.log('Successfully connected to the database');
}).catch((err) => {
  console.log('Could not connect to the database. Exiting now...', err);
  process.exit();
});

app.get('/', (req, res) => {
  res.json({message: 'Welcome to EasyProduits application'});
});

// creat socket server
const serve = http.createServer(app);
const io = socketServer(serve);
serve.listen(3033, () => {
  console.log('+++Gethyl Express Server with Socket Running!!!');
});


const connections = [];
io.on('connection', function(socket) {
  console.log('Connected to Socket!!' + socket.id);
  connections.push(socket);
  socket.on('disconnect', function() {
    console.log('Disconnected - ' + socket.id);
  });
  // socket.emit('ProductAdded', null)
  // detection of delete product
  socket.on('DeleteProduct', (idDeletedProduct) => {
    // notify all clients
    io.emit('NotifyToDelete', idDeletedProduct);
    console.log('produit deleted - ' + idDeletedProduct);
  });
  socket.on('UpdateProduct', (UpdateProduct) => {
    io.emit('NotifyToUpdate', UpdateProduct);
    console.log('produit Updated - ' + UpdateProduct.name);
  });
});
// Require Produits routes
require('./app/routes/produit.routes.js')(app);


// listen for requests
app.listen(3023, () => {
  console.log('Server is listening on port 3023');
});
