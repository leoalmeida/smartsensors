#!/usr/bin/env node

/*const http = require('http');

const port = process.env.PORT || 3000;
const app = require('../app');
const httpServer = http.createServer(app);
//const sockets = require('../sensors')(httpServer);

httpServer.listen(port, function(){
  console.log('Listen on port ' + port);
});
*/

var debug = require('debug')('smartsensors');
var app = require('../app');

app.set('port', process.env.PORT || 3001);

var server = app.listen(app.get('port'), function() {
  console.log('Express server is in '+process.env.NODE_ENV+' mode and listening on port ' + server.address().port);

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
