'use strict';

//const db = require('./db');
const express = require('express');
const bodyParser = require('body-parser');
// const cors = require('cors');
const path = require('path');
const app = express();

// Application config
// app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// configure Middlewares
app.use(require('./middlewares/i18n-middleware'));
// app.use(require('./middlewares/auth-middleware'));

// Route config
// app.use(require('./routes/transaction-routes'));
//app.use(require('./routes/user-routes'));

// Config Error Handdler
app.use(require('./middlewares/error-middleware'));

//configure public folders
app.use('/', express.static(path.resolve('wwwroot', '../web/src')));

module.exports = app;
