'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

////////////////////////////////////////////////////////////////
const logger = require('morgan');
const load = require('express-load');
const config = require('./config/config');
const mongoose = require("mongoose");
const db = require('./db');
const getDecorateIO = require('./modules/board');
////////////////////////////////////////////////////////////////

const app = express();

////////////////////////////////////////////////////////////////
// Application config
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

////////////////////////////////////////////////////////////////
app.use(logger('dev'));

app.use(db);
app.use(getDecorateIO);

load("models", {cwd: 'server/app', verbose:true})
  .then("controllers", {cwd: 'server/app', verbose:true})
  .into(app);

require('./config/middlewares')(app);
require('./config/routes')(app);

//console.log('connected at port: ' + port);
console.log('server started');
////////////////////

module.exports = app;
