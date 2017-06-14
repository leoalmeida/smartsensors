'use strict'

let asyncObj = require('async');
let EtherPortClient = require("etherport-client").EtherPortClient;
let five = require('johnny-five');
const mongoose = require('mongoose');
let Knowledge = mongoose.model('Knowledge');

const equipmentController = require('./equipmentController');

const ctrl = {};

let dbq = asyncObj.queue(retrieveDbInfo, 5);
let boardq = asyncObj.queue(prepareBoardList, 5);
let updEquipq = asyncObj.queue(updateEquipmentStatus, 5);

ctrl.addNewBoards = (req, res, next) => {
  console.log('Starting to include new boards!');
  if (!req.body.boardKeys) return next({ data: req.body.boardKeys, code: 422, messageKeys: ['not-found'] });

  requestBoardsStart(boardKeys, includeNewBoards).then(value => {
    return res.status(200).json(value);
  });
};
ctrl.startBoards = (req, res, next) => {
  if (!req.body.boardKeys) return next({ data: req.body.boardKeys, code: 422, messageKeys: ['not-found'] });
  let boardKeys = req.body.boardKeys;
  //console.log('Board started doing the job!');
  let boardsItems = [];

  let createBoard = function(id, callback) {
    //callback(requestBoardsStart(boardKeys[id], callback));
    //console.log("xxxxx",boardKeys[id]);
    requestBoardsStart(boardKeys[id], function(board){
      //console.log("xxxxx",board);
      boardsItems.push(board);
      callback(null, board);
    });
    //requestBoardsStart(boardKeys[id], callback);
  };

  asyncObj.times(boardKeys.length, function(n, next) {
    createBoard(n, function(err, board) {
      next(err, board);
    });
  }, function(err, boards) {
      //console.log("teste",boards);
      let pool = ctrl.createBoardPool(boards);

      return res.status(200).json(data);
  });

};

module.exports = ctrl;

// assign callbacks
dbq.drain = dbqDrain;
boardq.drain = boardqDrain;
updEquipq.drain = updEquipqDrain;

function includeNewBoards(boardList){
  console.log("***** Boards are Ready to be connected");
  console.log("***** Connecting board List");
  boardList.each(function(board){
      boards.push(board);
      ctrl.startBoard(board);
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
function createBoardPool(boardsObjects){
    let ports = []
    for (let object of boardsObjects){
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
      ports.push(board);
    };

    return new five.Boards(ports);
    /*new five.Boards(ports).on("ready", function() {
      console.log("***** Boards are Ready to be connected");
      console.log("***** Connecting board List");
      this.each(function(board){
        ctrl.startBoard(board);
      });
      cb(this);
    });*/
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
};
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
      return equipmentController.startMotion(equipment, null);
      break;
    case "light":
      return equipmentController.startLight(equipment, null);
      break;
    case "temperature":
      return equipmentController.startThermometer(equipment, null);
      break;
    case "hygrometer":
      return equipmentController.startHygrometer(equipment, null);
      break;
    case "sensor":
      return equipmentController.startSensor(equipment, null);
      break;
    case "flow":
      return equipmentController.startFlow(equipment, null);
      break;
    case "relay":
      return equipmentController.startRelay(equipment, null);
      break;
    case "led":
      return equipmentController.startLed(equipment, null);
      break;
  }
};
function updateEquipmentStatus(task, callback){
  console.log('Request Board Status change: ', task.equipmentId);
  console.log("to:", task.status);
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
