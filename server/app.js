'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

////////////////////////////////////////////////////////////////
const logger = require('morgan');
const load = require('express-load');
const cookieParser = require('cookie-parser');
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')
const config = require('./app/config/config')
const mongoose = require("mongoose")
////////////////////////////////////////////////////////////////

const app = express();

////////////////////////////////////////////////////////////////
var port = process.env.PORT || 3001;
var host = "127.0.0.1";
console.log('host address: ' + host);
////////////////////////////////////////////////////////////////

// Application config
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

////////////////////////////////////////////////////////////////
app.set('views', path.join(__dirname, 'app/views'));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, '../Uploads')));
app.use(cookieParser()); // read cookies (needed for auth)
app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
	secret: 'keepthisstringsecret',
	resave: true,
	saveUninitialized: true
	})
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(flash()); // use connect-flash for flash messages stored in session

//Finilize  --------------------------------------------------------------------

var connect = function(){
   var options = {
      server: {
         socketOptions:{
            keepAlive : 1
         }
      }
   };
   mongoose.connect(config.db,options);
};
connect();

mongoose.connection.on('error',console.log);
mongoose.connection.on('disconnected',connect);
console.log('Mongo db connected');


load("models", {cwd: 'server/app', verbose:true})
  .then("controllers", {cwd: 'server/app', verbose:true})
  .into(app);


//bootstrap models
/*fs.readdirSync(__dirname + '/app/models').forEach(function (file) {
   if (~file.indexOf('.js')) require(__dirname + '/app/models/' + file);
});*/
require('./app/config/passport')(passport);
require('./app/config/middlewares')(app);
require('./app/config/routes')(app);

console.log('connected at port: ' + port);
console.log('server started');
////////////////////

module.exports = app;
