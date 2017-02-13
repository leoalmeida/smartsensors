'use strict';

// ******** Initialize Firebase
const admin = require("firebase-admin");

const serviceAccount = require("./bin/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://guifragmentos.firebaseio.com"
});

const db = admin.database();

module.exports = db;

// const Lancamento = require('./models/transaction-model');
// const mongoose = require('mongoose');

// mongoose.connect('mongodb://dev:dev@ds021731.mlab.com:21731/finance');
// mongoose.connect('mongodb://dev:dev@ds017195.mlab.com:17195/smartsensors');
/*
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
*/