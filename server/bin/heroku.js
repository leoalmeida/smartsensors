'use strict'

const http = require('http');
const port = process.env.PORT || 3000;
const app = require('../app');
const httpServer = http.createServer(app);

httpServer.listen(port, function(){
  console.log('Listen on port ' + port);
});
