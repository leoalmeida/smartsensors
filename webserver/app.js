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
const gcm = require('node-gcm');

const db = require('./db');
////////////////////////////////////////////////////////////////

const app = express();

////////////////////////////////////////////////////////////////

// Application config
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
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

// Prepare a message to be sent
/*let message = new gcm.Message({
	collapseKey: 'demo',
	priority: 'high',
	contentAvailable: true,
	delayWhileIdle: true,
	timeToLive: 3,
	restrictedPackageName: "somePackageName",
	dryRun: true,
	data: {
		key1: 'message1',
		key2: 'message2'
	},
	notification: {
		title: "Hello, World",
		icon: "ic_launcher",
		body: "This is a notification that will be displayed if your app is in the background."
	}
});

// Change the message data
// ... as key-value
message.addData('key1','message1');
message.addData('key2','message2');

let sender = new gcm.Sender('AAAA6GzE2wI:APA91bE4EUkEnfM-cmx7VII85AD0HRggSidU3cuUxKNsfeRXbLhjqGTs_kAsHc5bye3WpxUNlUjKussEgzasxUxyEhgVNEfCSAKtHDs0WvlsWioRqCG92-GlGTvVZaYzQlxyVT4Ogur8');

// Add the registration tokens of the devices you want to send to
var registrationTokens = [];
registrationTokens.push('998257253122');

// Actually send the message
sender.sendNoRetry(message, { registrationTokens: registrationTokens }, function(err, response) {
  if(err) console.error(err);
  else    console.log(response);
});*/

//Finilize  --------------------------------------------------------------------

/*
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
*/

load("models", {cwd: 'webserver/app', verbose:true})
  .then("controllers", {cwd: 'webserver/app', verbose:true})
  .into(app);


//bootstrap models
/*fs.readdirSync(__dirname + '/app/models').forEach(function (file) {
   if (~file.indexOf('.js')) require(__dirname + '/app/models/' + file);
});*/
require('./app/config/passport')(passport);
require('./app/config/middlewares')(app);
require('./app/config/routes')(app);

//console.log('connected at port: ' + port);
console.log('server started');
////////////////////

module.exports = app;
