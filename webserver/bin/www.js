#!/usr/bin/env node

const debug = require('debug')('smartsensors');
const http = require('http');
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('./webserver/bin/key.pem'),
  cert: fs.readFileSync('./webserver/bin/cert.pem')
};

const app = require('../app');

app.set('port', process.env.PORT || 3001);
app.set('httpsport', process.env.PORT || 3002);

//const httpServer = http.createServer(app);
/*
http.createServer(app).listen(app.get('port'), function(){
  console.log('Listen Http on port ' + app.get('port'));
});*/
https.createServer(options, app).listen(app.get('httpsport'), function(){
  console.log('Listen Https on port ' + app.get('httpsport'));
});

//const sockets = require('../sensors')(httpServer);

/*
var app = require('../app');

app.set('port', process.env.PORT || 3001);
*/
var server = app.listen(app.get('port'), function() {
  console.log('Express server is in '+process.env.NODE_ENV+' mode and listening on port ' + server.address().port);

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
