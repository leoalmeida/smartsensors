#!/usr/bin/env node

const debug = require('debug')('smartsensors');
const http = require('http');
const https = require('https');
const fs = require('fs');
const ws = require('nodejs-websocket');


const options = {
  key: fs.readFileSync('./webserver/bin/key.pem'),
  cert: fs.readFileSync('./webserver/bin/cert.pem')
};

const app = require('../app');
app.set('port', process.env.PORT || 3001);
app.set('httpsport', process.env.PORT || 3002);

https.createServer(options, app).listen(app.get('httpsport'), function(){
  console.log('Listen Https on port ' + app.get('httpsport'));
});

const mqttServ = require('../mqttserver');
mqttServ.attachHttpServer(app);

var httpServ = app.listen(app.get('port'), function() {
  console.log('Express server is in '+process.env.NODE_ENV+' mode and listening on port ' + httpServ.address().port);

  var host = httpServ.address().address;
  var port = httpServ.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

/*
const async = require('async');
const actionCtrl = require('../app/controllers/wsActionCtrl');

// 2. Server for incoming/outgoing messages
var wsServer = ws.createServer(function (conn) {

	console.log('New ws connection established.', new Date().toLocaleTimeString());

	conn.on('text', function (msg) {
		// simple object transformation (= add current time)
		var req = JSON.parse(msg);
    console.log(req);
    var selectRoute = (route) => {
      switch (route) {
        case '/boards/connect':
          return async.compose(actionCtrl.connectEquipments, actionCtrl.auth);
        case '/boards/disconnect':
          return async.compose(actionCtrl.disconnectEquipments, actionCtrl.auth);
        case '/topic/dynamic':
          return  async.compose(actionCtrl.processDynamic, actionCtrl.auth);
        case '/topic/static':
          return  async.compose(actionCtrl.processDynamic, actionCtrl.auth);
        case '/start':
          return  async.compose(actionCtrl.actionRequest, actionCtrl.auth);
        default:
          return  async.compose(() => {return {data: {}, err: {code: 400, msg:"Error"}}});
      }
    }

    var compose = selectRoute(req.route);

    if (req.route === '/topic/dynamic' )
        async.during(
          function(callback){
            actionCtrl.verifyStatus(req, function(result){
              console.log(result);
              return callback(null, result.code>0);
            })
          },
          function(callback){
            compose(req, sendMsg)
            setTimeout(callback, 5000);
          },
          function (err, n) { console.log("finished", err)}
        );
    else {
        compose(req, sendMsg);
    }

    function sendMsg(err, result) {
      console.log(err);
      console.log(result);
      var returnMsgObj = {};

      returnMsgObj.author = "server";
      returnMsgObj.route = req.route;
      returnMsgObj.sync = result[0].result.sync;
      if (err) returnMsgObj.err = err;
      else {
        returnMsgObj.knowledgeMessage = result[0].data.message;
        returnMsgObj.knowledgeMessage.data.status = result[0].status;
        returnMsgObj.knowledgeMessage.data.value = result[0].result.value;
        returnMsgObj.knowledgeMessage.data.equipments = result[0].equipments;
      }

      console.log("OBJETO",returnMsgObj);

  		var newMsg = JSON.stringify(returnMsgObj);

  		// echo message including the new field to all connected clients
  		wsServer.connections.forEach(function (conn) {
  			conn.sendText(newMsg);
  		});
    }

	});
	conn.on('close', function (code, reason) {
		console.log('Chat connection closed.', new Date().toLocaleTimeString(), 'code: ', code);
	});

	conn.on('error', function (err) {
		// only throw if something else happens than Connection Reset
		if (err.code !== 'ECONNRESET') {
			console.log('Error in Chat Socket connection', err);
			throw  err;
		}
	})
}).listen(3005, function () {
	console.log('Web Socket Server running on localhost:3005');
});
*/
