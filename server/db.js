'use strict';

// ******** Initialize Firebase
/*const admin = require("firebase-admin");

const serviceAccount = require("./bin/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://guifragmentos.firebaseio.com"
});

const db = admin.database();

module.exports = db;
*/

const Configurations = require('./models/configurations-model');
const Associations = require('./models/associations-model');
const Objects = require('./models/objects-model');
//const Knowledge = require('./models/knowledge-model');
//const Contexts = require('./models/contexts-model');
//const Semantics = require('./models/semantics-model');
const mongoose = require('mongoose');

mongoose.connect('mongodb://dev:dev@ds060649.mlab.com:60649/guifragmento');

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Connected!');
});

db.on('open', () => {
  console.log('MongoDB Opened!');

  _lancamento.save((err, data) => {
    if (err) {
      console.log(err);
    }else {
      console.log(data);
    }
  })
});

db.on('disconnected', () => {
  console.log('MongoDB disconnected.');
});

db.on('error', err => {
  console.log(`MongoDB error: ${err}`);
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB disconnected through app termination');
    process.exit(0);
  });
});

module.exports = db;
