var EtherPortClient = require("etherport-client").EtherPortClient;
var five = require('johnny-five');
const db = require('../../db');
const mongoose = require('mongoose');
var Knowledge = mongoose.model('Knowledge');
var asyncObj = require('async');

var util = require('util');

const connectedBoards = {length: 0};
let equipments;

const getEquipmentDecoratorIO = require('./equipment-decorator');
var equipmentDecorator = getEquipmentDecoratorIO(db);

// create a queue object with concurrency 2

module.exports = getEquipmentDecorateIO;

function getEquipmentDecorateIO() {

  let methods = {
    addNewEquipments: addNewEquipments,
    connectEquipments: connectEquipments,
    toggleEquipmentsStatus: toggleEquipmentsStatus,

    includeNewEquipments: includeNewEquipments,
    requestEquipmentsStart: requestEquipmentsStart,
    requestStatusToggle: requestStatusToggle,
    retrieveDbInfo: retrieveDbInfo,
    prepareEquipmentList: prepareEquipmentList,
    addBoardToPool: addBoardToPool,
    updateEquipmentPool: updateEquipmentPool,
    startEquipment: startEquipment,
    toggleStatus: toggleStatus
  };

  let dbq = asyncObj.queue(methods.retrieveDbInfo, 5);
  let equipmentq = asyncObj.queue(methods.prepareEquipmentList, 5);
  let updEquipq = asyncObj.queue(methods.toggleStatus, 5);

  function addNewEquipments(keys, callback){
    console.log('Starting to include new equipments!');

    methods.requestEquipmentsStart(keys, methods.includeNewEquipments);

    //equipmentsStart(equipmentKeys, createEquipments);
  };
  function toggleEquipmentsStatus(keys, cb){
    let updateEquipment = function(id, callback) {
      verifyEquipmentStatus(keys[id].keyId, function(equip){
        if (!equip) {
          console.log('Equipment not found!');
          callback(null, null);
        }else{
          methods.requestStatusToggle({ equipmentId: keys[id].keyId, status: keys.status}, function(equipment){
              console.log("xxxxx",equipment);
              callback(null, equipment);
          });
        };
      });
    };

    asyncObj.times(keys.length, function(n, next) {
      updateEquipment(n, function(err, equipment) {
        next(err, equipment);
      });
    }, function(err, equipments) {
        console.log(equipments);
        if (equipments)
          methods.updateEquipmentPool(equipments, cb);
        else
          cb([]);
    });
  }
  function connectEquipments(keys, cb){
    console.log('Equipment started doing the job!');
    let equipmentsItems = [];
    let updateEquipments = [];

    let createEquipment = function(id, callback) {
      verifyEquipmentStatus(keys[id].keyId, function(status){
        if (!status.data.enabled){
          console.log('Equipment was unable to start!');
          callback({err: { code: 400, msg: "Error: Equipment was unable to start!" }}, null);
        }else if (status.type !== "complex"){

          if (connectedBoards[status.boardkey].startedList[keys[id].keyId]){
            console.log('Equipment already added to the pool!');
            updateEquipments.push(keys[id]);
            callback(null, null);
          }else{
            methods.requestEquipmentsStart(keys[id], function(equipment){
              console.log("xxxxx",equipment);
              equipmentsItems.push(equipment);
              callback(null, equipment);
            });
          };
        }else{
          ///TODO trabalhar utilizando equipamentos complexos
          console.log('Equipment was unable to start!');
          callback({err: { code: 500, msg: "Error: function Not-found" }}, null);
        };
      });
    };

    asyncObj.times(keys.length, function(n, next) {
      createEquipment(n, function(err, equipment) {
        next(err, equipment);
      });
    }, function(err, equipments) {
        //console.log("teste",equipments);
        for (let object of equipments){
          if (!object) continue;
          methods.addBoardToPool(object);
        }
        if (updateEquipments.length)
          methods.toggleEquipmentsStatus(updateEquipments, cb)
        else
          cb(equipmentsItems);
    });
  };
  function includeNewEquipments(equipmentList){
    console.log("***** Equipments are Ready to be connected");
    console.log("***** Connecting equipment List");
    equipmentList.each(function(equipment){
        equipments.push(equipment);
        methods.startEquipment(equipment);
      });
  }
  function requestEquipmentsStart(equipmentKey, cb){
    dbq.push(equipmentKey, function (data) {
      if(data.err){
        console.log('Ocurred the following error: ', data.err);
      }else{
        if(data.equipment){
          console.log('****** Retrieve of');
          console.log('> Sink: ', data.equipment._id);
        }
        if(data.equipments){
          console.log('---> Equipments: ');
          for (let eqp of data.equipments){
            console.log("--->",eqp._id);
          }
        }
        console.log("***** Finished");
        equipmentq.push(data, cb);
      }
    });
  }
  function requestStatusToggle(equipmentData, cb){
    updEquipq.push(equipmentData, function(data){
      if(data.err){
        console.log('Ocurred the following error: ', data.err);
      }else{
        if(data.equipment){
          console.log('****** Update of');
          console.log('> Equipment: ', data.equipment._id);
        }
        console.log("***** Finished");
        cb({
          id: data.equipment._id
        });
      }
    });
  }
  function retrieveDbInfo(task, cb){
    console.log('Request Equipment Info: ', task.keyId);
    Knowledge.findOne(mongoose.Types.ObjectId(task.keyId)).then(item => {

      if (!equip) {
        console.log("Error: Not-found");
        callback({err: { code: 400, msg: "Error: Not-found" }});
      }
      let equip = item.toJSON();
      console.log('Request Equipments from: ', equip._id);
      Knowledge.find({"relations.abstractions": { $elemMatch: { "id": {$eq: mongoose.Types.ObjectId(equip._id)}}}})
        .then(components => {
          if (!components) {
            console.log("Error: Not-found");
            cb({err: { code: 400, msg: "Error: Not-found" }});
          };
          cb({
            id: task.equipment._id,
            boardkey: [task.equipment.connection.host,task.equipment.connection.port].join(":"),
            connection: new EtherPortClient({
                host: task.equipment.connection.host,
                port: task.equipment.connection.port
            }),
            equipment: equip,
            components: components,
            err: ""
          });
        }).catch(err => {
          console.log("err" + err);
          cb({err: err});
        });
    }).catch(err => {
      console.log("err", err);
      cb({err: err});
    });
  }
  function prepareEquipmentList(task, cb){
    console.log("----> Starting: ");
    if (task.err) {
      console.log("Error: ", task.err);
    };
    console.log("----> ", task.equipment._id.toString());
    cb(task);
  };
  function updateEquipmentPool(equipmentsObjects){
    let updatedEquipments = [];
    if (!connectedBoards.length) return updatedEquipments;
    for (let object of equipmentsObjects){
      if (!object || connectedBoards[object.equipId]) continue;
      connectedBoards[object.equipId].toggleConnect();
      updatedEquipments.push(object.equipId);
    }
    return updatedEquipments;
  }
  function addBoardToPool(equipment){
    if (!connectedBoards[equipment.boardkey]){
      connectedBoards["length"]++;
      connectedBoards[equipment.boardkey] = {};
      connectedBoards[equipment.boardkey].ready = false;
      connectedBoards[equipment.boardkey].equipments = [];
      connectedBoards[equipment.boardkey].equipments.push(equipment);
      connectedBoards[equipment.boardkey].startedList = {};

      let boardConfig = {
        port: equipment.connection,
        timeout: 1e5,
        repl:true
      };
      let board = new five.Board(boardConfig);
      board.boardKey = equipment.boardKey;
      board.startedList = connectedBoards[equipment.boardkey].startedList;

      board.on("ready", function() {
          console.log("***** Ready");
          for (let equip of connectedBoards[this.boardKey].equipments){
            console.log("> Connecting to: ", this.boardKey);
            console.log("--> equip: ", equip._id);
            console.log("----> type: ", equip.type);
            console.log("----> **** Category:", equip.category);
            let equipObj = methods.startEquipment(equip);

            connectedBoards[this.boardKey].board.repl.inject({[equipObj.id]: equipObj});
            connectedBoards[equipment.boardkey].startedList[equipObj.id] = equipObj;

            updEquipq.push({ equipmentId: equipObj.id, status: true}, null);
            console.log("> Connected: ", equipObj.id);
          };

          connectedBoards[this.boardKey].ready = true;

          this.on("message", function (message) {
            console.log("Received a message: ",message);
          });
          this.on("exit", function() {
                console.log("> Exiting: ", this.boardKey);
                for (let equip of connectedBoards[this.boardKey]){
                  updEquipq.push({ equipmentId: equip.id, status: false}, null);
                  console.log("> Exiting: ", equip.id);
                }
              });

          delete connectedBoards[this.boardKey].equipments;
      });
      board.on("close", function() {
        console.log("> Closing board: ", this.boardKey);
        let connectedEquips = connectedBoards[this.boardKey].startedList;
        for (let equip in Object.Keys(connectedEquips)){
          updEquipq.push({ equipmentId: connectedEquips[equip].id, status: false}, null);
          console.log("> Closing: ", connectedEquips[equip].id);
        }
        delete connectedBoards[this.boardKey];
        connectedBoards.length--;
      });
      board.on('error', function(err) {
        console.log("> Error on board: ", this.boardKey);
        let connectedEquips = connectedBoards[this.boardKey].startedList;
        for (let equip in Object.Keys(connectedEquips)){
          updEquipq.push({ equipmentId: connectedEquips[equip].id, status: false}, null);
          console.log("> Closing due Error: ",connectedEquips[equip].id);
        }
        console.error(">ErrorMsg:  ",err);
        delete connectedBoards[this.boardKey];
        connectedBoards.length--;
      })

      connectedBoards[equipment.boardkey].board = board;
    }else if(!connectedBoards[equipment.boardkey].ready){
      console.log("> Board already exists but not started yet: ", equipment.boardKey);
      console.log("> including equipment to the pool");
      connectedBoards[equipment.boardKey].equipments.push(equipment);
    }else{
      console.log("> Board already started");
      //console.log("> Restart the board to reflect changes.");
      console.log("> Connecting new equipment to: ", equipment.boardKey);
      console.log("--> equip: ", equipment.id);
      console.log("----> type: ", equipment.equipment.type);
      console.log("----> **** Category:", equipment.equipment.category);

      let equipObj = methods.startEquipment(equipment)
      connectedBoards[equipment.boardKey].board.repl.inject({[equipObj.id]: equipObj});
      connectedBoards[equipment.boardkey].startedList[equipObj.id] = equipObj;
      updEquipq.push({ equipmentId: equipObj.id, status: true}, null);
      console.log("> Connected: ", equipObj.id);
    };
    //if (!addNew && equipmentsObjects) equipments = new five.Boards(connectedBoards);
    //return equipment;
  };

  function toggleStatus(task, cb){
    console.log('Equipment Status change Requested for: ', task._id);
    console.log("to status :", (task.status)? "connected": "disconnected" );
    Knowledge.update({"_id" : mongoose.Types.ObjectId(task._id)}, {$set: {"data.connected": task.status}})
              .catch(err => {
                console.log("err" + err);
              });
  }
  // assign callbacks
  dbq.drain = dbqDrain;
  equipmentq.drain = equipmentqDrain;
  updEquipq.drain = updEquipqDrain;

  return {
    addNewEquipments: methods.addNewEquipments,
    connectEquipments: methods.connectEquipments,
    toggleEquipmentsStatus: methods.toggleEquipmentsStatus
  };
};

//------ helper function
function equipmentsConnected(data) {
  if(data.err){
    console.log('Ocurred the following error: ', data.err);
  }else{
    console.log('Equipment: ' + data.id + ' connected successfully.' );
  }
};

function startEquipment(equipment){
  switch (equip.category) {
    case "motion":
      return equipmentDecorator.startMotion(equipment, null);
      break;
    case "light":
      return equipmentDecorator.startLight(equipment, null);
      break;
    case "temperature":
      return equipmentDecorator.startThermometer(equipment, null);
      break;
    case "hygrometer":
      return equipmentDecorator.startHygrometer(equipment, null);
      break;
    case "sensor":
      return equipmentDecorator.startSensor(equipment, null);
      break;
    case "flow":
      return equipmentDecorator.startFlow(equipment, null);
      break;
    case "relay":
      return equipmentDecorator.startRelay(equipment, null);
      break;
    case "led":
      return equipmentDecorator.startLed(equipment, null);
      break;
  }
};
function equipmentUpdated(data){
  if(data.err){
    console.log('Ocurred the following error: ', data.err);
  }else{
    console.log('Equipment: ' + data.id + ' updated successfully.' );
  }
}
function verifyEquipmentStatus(objectid, cb){
  Knowledge.findOne({"_id" : mongoose.Types.ObjectId(objectid)},{"data.enabled": 1, "data.connected": 1})
            .then(data => {
              console.log(data);
              cb(data);
            })
            .catch(err => {
              console.log("err" + err);
            });
}
function dbqDrain() {
  console.log('No more equipments to retrieve.');
  //console.log('Finished to retrieve: ' +  equipments.length + ' equipments.');
  //equipmentq.push(equipments, equipmentsConnected);
  //let req = requestEquipmentsStart(equipments);
}
function equipmentqDrain() {
  console.log('No more equipments to start.');
}
function updEquipqDrain() {
  console.log('No more equipments to update.');
}
