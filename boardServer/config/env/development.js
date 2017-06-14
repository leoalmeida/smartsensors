var mosca = require('mosca');

//let dbUrl = 'mongodb://localhost:27017/';

let dbUrl = 'mongodb://200.18.98.206:27017/';

let mqttConfig = {
  id: 'smartSensors', // used to publish in the $SYS/<id> topicspace
  stats: false, // publish stats in the $SYS/<id> topicspace
  logger: {
    level: 'debug'
  },
  port: 1883,
  backend: {
    type: 'mongodb',
    url: dbUrl + 'mqtt',
    pubsubCollection: 'smartSensors',
    mongo: {}
  },
  persistence: {
    factory: mosca.persistence.Mongo,
    url: dbUrl + 'mqtt',
        ttl: {
            subscriptions: 60 * 60 * 1000,
            packets: 60 * 60 * 1000
        }
  }
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
