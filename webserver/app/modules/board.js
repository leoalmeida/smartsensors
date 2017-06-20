
//motion
var EtherPortClient = require("etherport-client").EtherPortClient;
var five = require('johnny-five');
const db = require('../db');
const mongoose = require('mongoose');
var Knowledge = mongoose.model('Knowledge');
var asyncObj = require('async');

var util = require('util');

const connectedBoards = [];
let boards;

const getEquipmentDecorateIO = require('./equipment-decorator');
var equipmentDecorator = getEquipmentDecorateIO(db);

// create a queue object with concurrency 2

module.exports = getBoardDecorateIO;

function getBoardDecorateIO() {

  let methods = {
    addNewBoards: addNewBoards,
    connectBoards: connectBoards,
    disconnectBoards: disconnectBoards,

    includeNewBoards: includeNewBoards,
    requestBoardsStart: requestBoardsStart,
    retrieveDbInfo: retrieveDbInfo,
    prepareBoardList: prepareBoardList,
    createBoardPool: createBoardPool,
    startBoard: startBoard
  };

  let dbq = asyncObj.queue(methods.retrieveDbInfo, 5);
  let boardq = asyncObj.queue(methods.prepareBoardList, 5);
  let updEquipq = asyncObj.queue(updateEquipmentStatus, 5);

  function addNewBoards(boardKeys, callback){
    console.log('Starting to include new boards!');

    methods.requestBoardsStart(boardKeys, methods.includeNewBoards);

    //boardsStart(boardKeys, createBoards);
  };
  function disconnectBoards(boardKeys, cb){
    let updatedBoard = function(id, callback) {
      verifyBoardStatus(boardKeys[id].boardId, function(status){
        if (!status) {
          console.log('Equipment already disconnected!');
          callback(null, null);
        }else{
          updEquipq.push({ equipmentId: boardKeys.boardId, status: false}, function(board){
            boardsItems.push({
              board: boardKeys.boardId,
              equipments: boardKeys,
              status: true
            });
            callback(null, board);
          });
        };
      });
    };

    asyncObj.times(boardKeys.length, function(n, next) {
      createBoard(n, function(err, board) {
        next(err, board);
      });
    }, function(err, boards) {
        console.log(boards);
        cb(boardsItems);
    });
  }
  function connectBoards(boardKeys, cb){
    console.log('Board started doing the job!');
    let boardsItems = [];

    let createBoard = function(id, callback) {
      verifyBoardStatus(boardKeys[id].boardId, function(status){
        if (status) {
          console.log('Equipment already started!');
          callback(null, null);
        }else{
          methods.requestBoardsStart(boardKeys[id], function(board){
            //console.log("xxxxx",board);
            boardsItems.push({
              board: board.id,
              equipments: board.equipments,
              status: true
            });
            callback(null, board);
          });
        };
      });
    };

    asyncObj.times(boardKeys.length, function(n, next) {
      createBoard(n, function(err, board) {
        next(err, board);
      });
    }, function(err, boards) {
        //console.log("teste",boards);
        if (boards) methods.createBoardPool(boards);
        cb(boardsItems);
    });
  };
  function includeNewBoards(boardList){
    console.log("***** Boards are Ready to be connected");
    console.log("***** Connecting board List");
    boardList.each(function(board){
        boards.push(board);
        methods.startBoard(board);
      });
  }
  function requestBoardsStart(boardKey, cb){
    dbq.push(boardKey, function (data) {
      if(data.err){
        console.log('Ocurred the following error: ', data.err);
      }else{
        if(data.sink){
          console.log('****** Retrieve of');
          console.log('> Sink: ', data.sink._id);
        }
        if(data.equipments){
          console.log('---> Equipments: ');
          for (let eqp of data.equipments){
            console.log("--->",eqp._id);
          }
        }
        console.log("***** Finished");
        boardq.push(data, cb);
      }
    });
  }
  function retrieveDbInfo(task, cb){
    console.log('Request Board Info: ', task.boardId);
    Knowledge.findOne(mongoose.Types.ObjectId(task.boardId)).then(sink => {

      if (!sink) {
        console.log("Error: Not-found");
        callback({err: { code: 400, msg: "Error: Not-found" }});
      }
      let thisSink = sink.toJSON();
      console.log('Request Equipments from: ', thisSink._id);
      Knowledge.find({"relations.connectedTo": { $elemMatch: { "id": {$eq: mongoose.Types.ObjectId(thisSink._id)}}}})
        .then(equipments => {
          if (!equipments) {
            console.log("Error: Not-found");
            cb({err: { code: 400, msg: "Error: Not-found" }});
          };
          cb({
            sink: thisSink,
            equipments: equipments,
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
  function prepareBoardList(task, cb){
    console.log("----> Starting: ");
    if (task.err) {
      console.log("Error: ", task.err);
    };
    console.log("----> ", task.sink._id.toString());
    cb({
      id: task.sink._id,
      port: new EtherPortClient({
          host: task.sink.connection.host,
          port: task.sink.connection.port
      }),
      timeout: 1e5,
      equipments: task.equipments
    });
  };
  function createBoardPool(boardsObjects){
    let addNew = connectedBoards.length;
    for (let object of boardsObjects){
      if (!object) continue;
      let board = new five.Board(object);
      board.on("ready", function() {
              console.log("***** Ready");
              console.log("> Connecting: ", board.id);
              for (equip of board.equipments){
                console.log("----> Equip: ", equip._id);
                console.log("----> **** Category:", equip.category);
                let equipObj = startEquipment(equip)
                //this.repl.inject({[equip._id]: equipObj});
                updEquipq.push({ equipmentId: equip.id, status: true}, equipmentUpdated);
              }
              updEquipq.push({ equipmentId: board.id, status: true}, equipmentUpdated);
              console.log("> Connected: ", board.id);

              board.on("message", function (message) {
                console.log("Received a message: ",message);
              });
              this.on("exit", function() {
                updEquipq.push({ equipmentId: board.id, status: false}, equipmentUpdated);
                console.log("> Exiting: ", this.id);
              });
            });

      board.on("close", function() {
        updEquipq.push({ equipmentId: board.id, status: false}, equipmentUpdated);
        console.log('>closed')
      });
      board.on('error', function(err) {
        updEquipq.push({ equipmentId: board.id, status: false}, equipmentUpdated);
        console.error(">Error:  ",err)
      })
      connectedBoards.push(board);
    };

    if (!addNew && boardsObjects) boards = new five.Boards(connectedBoards);
    return boards;
  };
  function startBoard(board){
    console.log(board.repl);
    updEquipq.push({ equipmentId: board.id, status: true}, equipmentUpdated);
    console.log("> Connecting: ", board.id);
    for (equip of board.equipments){
      console.log("----> Equip: ", equip._id);
      console.log("----> **** Category:", equip.category);
      board.repl.inject({[equip._id]: startEquipment(equip)});
      updEquipq.push({ equipmentId: equip.id, status: true}, equipmentUpdated);
    }
    console.log("> Connected: ", board.id);

    board.on("string", function (message) {
      console.log(message);
    });

    board.on("exit", function() {
      console.log("> Exiting: ", board.id);
      updEquipq.push({ equipmentId: board.id, status: false}, equipmentUpdated);
    });
  }

  // assign callbacks
  dbq.drain = dbqDrain;
  boardq.drain = boardqDrain;
  updEquipq.drain = updEquipqDrain;

  return {
    startBoardb: methods.startBoardb,
    addNewBoards: methods.addNewBoards,
    connectBoards: methods.connectBoards
  };
};

//------ helper function
function boardsConnected(data) {
  if(data.err){
    console.log('Ocurred the following error: ', data.err);
  }else{
    console.log('Board: ' + data.id + ' connected successfully.' );
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
function updateEquipmentStatus(task, callback){
  console.log('Equipment Status change Requested for: ', task.equipmentId);
  console.log("to status :", (task.status)? "connected": "disconnected" );
  Knowledge.update({"_id" : mongoose.Types.ObjectId(task.equipmentId)}, {$set: {"data.connected": task.status}})
            .catch(err => {
              console.log("err" + err);
            });
}
function equipmentUpdated(data){
  if(data.err){
    console.log('Ocurred the following error: ', data.err);
  }else{
    console.log('Equipment: ' + data.id + ' updated successfully.' );
  }
}
function verifyBoardStatus(objectid, cb){
  Knowledge.findOne({"_id" : mongoose.Types.ObjectId(objectid)},{"data.connected": 1})
            .then(data => {
              console.log(data);
              cb(data.data.connected);
            })
            .catch(err => {
              console.log("err" + err);
            });
}
function dbqDrain() {
  console.log('No more boards to retrieve.');
  //console.log('Finished to retrieve: ' +  boards.length + ' boards.');
  //boardq.push(boards, boardsConnected);
  //let req = requestBoardsStart(boards);
}
function boardqDrain() {
  console.log('No more boards to start.');
}
function updEquipqDrain() {
  console.log('No more equipments to update.');
}
