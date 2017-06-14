#!/usr/bin/env node

const debug = require('debug')('smartsensors-boardServer');
const http = require('http');
const https = require('https');

const appserver = require('../appserver');

appserver.set('port', process.env.PORT || 4001);
appserver.set('httpsport', process.env.PORT || 4002);

https.createServer(options, appserver).listen(appserver.get('httpsport'), function(){
  console.log('Listen Https on port ' + appserver.get('httpsport'));
});

//const sockets = require('../sensors')(httpServer);

var server = appserver.listen(appserver.get('port'), function() {
  console.log('Express server is in '+process.env.NODE_ENV+' mode and listening on port ' + server.address().port);

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
