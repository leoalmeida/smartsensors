'use strict';

const express = require('express');
const bodyParser = require('body-parser');
// const cors = require('cors');
const path = require('path');
const app = express();

// Application config
// app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//configure public folders
app.use('/', express.static(path.resolve('wwwroot', '../web/src')));

// configure Middlewares
app.use(require('./middlewares/i18n-middleware'));
app.use(require('./middlewares/auth-middleware'));

// Route config
app.use(require('./routes/retrieve-routes'));
app.use(require('./routes/trigger-routes'));
app.use(require('./routes/remove-routes'));
// app.use(require('./routes/transaction-routes'));
// app.use(require('./routes/user-routes'));

// Config Error Handdler
app.use(require('./middlewares/error-middleware'));

module.exports = app;
