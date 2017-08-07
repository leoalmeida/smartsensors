let dbUrl = 'mongodb://localhost:27017/';
let mqttHost = '://localhost:';
let mqttport = 1883;
let mqttsport = 1883;
let SERVER_ID = "complexServer";
let PROCESS_SERVER_ID = "processTopic";

module.exports = {
    //db: 'mongodb://dev:dev@ds060649.mlab.com:60649/guifragmento',
    //db: 'mongodb://dev:dev@ds147965.mlab.com:47965/smartsensors',
    db: {
      url: dbUrl + 'dev',
      options:{
         server: {
            socketOptions:{
               keepAlive : 1
            }
         }
      }
    },
    mqtt:{
      url: {
        insecure: "mqtt" + mqttHost + mqttport + "/",
        secure:  "mqtts" + mqttHost + mqttsport + "/",
      },
      options: {
        clean: false,
        reconnectPeriod: 5000,
        clientId: SERVER_ID,
        username: "",
        password: "",
        will: {
          topic: SERVER_ID + "/offline",
          payload: "Server offline",
          qos: 0,
          retain: true
        },
        qos: 0
      },
      processServer: PROCESS_SERVER_ID
    },
    queues: {
      max: 10
    },
    loop: 20000,
    logPath: __dirname + "/var/log/app_dev.log",
    upPath: __dirname + "/documentos",
    appName: 'smartsensors',
    jsonType: 'application/vnd.api+json'
};
