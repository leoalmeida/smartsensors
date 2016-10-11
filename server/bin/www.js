'use strict'

const http = require('http');
const port = process.env.PORT || 3000;
const app = require('../app');
const httpServer = http.createServer(app);
//const sockets = require('../sensors')(httpServer);

httpServer.listen(port, function(){
  console.log('Listen on port ' + port);
});
