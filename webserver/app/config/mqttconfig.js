var mosca = require('mosca');

let dbUrl = 'mongodb://localhost:27017/';

var SECURE_KEY = __dirname + '/key.pem';
var SECURE_CERT = __dirname + '/cert.pem';

let mqttConfig = {
  id: 'smartSensors', // used to publish in the $SYS/<id> topicspace
  stats: false,  //(optional) if set to true mosca keep informing about the server status $SYS/<id> topicspace
  logger: {
    level: 'trace'
  },
  port: 1884, // default port is 1883 for mqtt
  /*** database settings for mongodb***/
  backend: {
    type: 'mongo',
    url: dbUrl + 'mqtt',
    pubsubCollection: 'ascoltatori',
    mongo: {}
  },
  /*##########################*/
  /*
   - this option will create a session over subscription and packets
     - `factory`       the persistence factory you want to choose from Mongo,Redis,LevelUp,Memory
     - `url`           the url of your persistence db
     - `ttl`(optional) the expiration of session
        - `subscriptions`  time period for subscriptions in ms (default 1 hour)
        - `packets`        time period for packets ini ms (default 1 hour)
     - `mongo`         the mongo specific options if any otherwise null object
     ** this module is specially used for retain messages
   */
  persistence: {
    factory: mosca.persistence.Mongo,
    url: dbUrl + 'mqtt',
    ttl: {
        subscriptions: 60 * 60 * 1000,
        packets: 60 * 60 * 1000
    }
  },
  //======== use these options for mqtts =======//


  //============= end =================//

  allowNonSecure: true,
  /*
     - this option will create a http server with mqtt attached.
       - `port`   (optional)   the http port to listen. default 3000
       - `bundle` (optional)   if set to true then mqtt.js file will be served,so
                               no need to download it.default is false.
       - `static` (optional)   provide your static files path.
      ** to access the mqtt.js or your static files put {yourhost}:{port}/staticfilename
     */
  http: {
    port: 3004,
    bundle: true,
    static: './public'
  },

  //======== use these options for https =======//
  secure : {
  	 port: 1883,               //provide secure port if any (default 8883 ssl)
	   keyPath: SECURE_KEY, //path of .pem file
     certPath: SECURE_CERT, //path of .pem file
     passphrase: 'testepem'
  },

  credentials: {
      keyPath: SECURE_KEY, //path of .pem file
      certPath: SECURE_CERT, //path of .pem file
      passphrase: 'testepem'
  }
  /*
  https:{
    port : 3030, //(optional default 3001)
    bundle : true,
    static : './public',
  }*/
  //============= end =================//
};

module.exports = {
    //db: 'mongodb://dev:dev@ds060649.mlab.com:60649/guifragmento',
    //db: 'mongodb://dev:dev@ds147965.mlab.com:47965/smartsensors',
    db: dbUrl + 'dev',
    mqtt: mqttConfig,
    logPath: __dirname + "/var/log/app_dev.log",
    upPath: __dirname + "/documentos",
    appName: 'smartsensors',
    jsonType: 'application/vnd.api+json'
};
