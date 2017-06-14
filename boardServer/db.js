const mongoose = require('mongoose');
let dbUrl = 'mongodb://localhost:27017/dev';
mongoose.connect(dbUrl);
const db = mongoose.connection;

db.on('connected', () => {
  console.log('Connected!');
});

db.on('open', () => {
  console.log('MongoDB Opened!');
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
