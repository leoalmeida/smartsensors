'use strict'

var mongoose = require('mongoose');
var Action = mongoose.model('Action');
var KnowledgeModel = mongoose.model('Knowledge');

const getBoardDecorateIO = require('../decorators/equipments');
let boardDecorator = getBoardDecorateIO();

const getTopicDecorateIO = require('../decorators/topic');
let topicDecorator = getTopicDecorateIO();

const ctrl = {};

ctrl.auth = (req, next) => {
  console.log("authenticated");
  req.authenticated = true;
  next(null, req);
}

ctrl.getById = (req, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  Action.find({"equipmentID": req.params.id}).then(data => {
    if (!data) {
      next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getById request");
    next(null, data);
  })
  .catch(err => {
    console.log("err" + err);
    next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

ctrl.getLastUpdates = (req, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  Action.getLastUpdates(req.params.id, req.params.sync).then(data => {
    if (!data) {
      next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getLastUpdates request");
    next(null, data);
  })
  .catch(err => {
    console.log("err" + err);
    next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

/**
*    ACTIONS
**/
ctrl.verifyStatus = (req, next) => {
  topicDecorator.verifyTopicStatus(req.knowledgeMessage.topicKeys[0].topicId, function(err, data){
    if (!data.enabled || data.status==="stopped") {
      console.log('Topic ' +  req.knowledgeMessage.topicKeys[0].topicId + ' stopped.');
      next({code: 0, status: data.status, msg: 'Topic ' +  req.knowledgeMessage.topicKeys[0].topicId + ' stopped.'});
    } else if (data.status==="running") {
      console.log('Topic ' +  req.knowledgeMessage.topicKeys[0].topicId + ' is running.');
      next({code: 1, status: data.status, msg: 'Topic ' +  req.knowledgeMessage.topicKeys[0].topicId + ' is running.'});
    } else {
      console.log('Topic ' +  req.knowledgeMessage.topicKeys[0].topicId + ' is starting.');
      next({code: 2, status: "starting", msg: 'Topic ' +  req.knowledgeMessage.topicKeys[0].topicId + ' starting.'});
    }
  });
}
ctrl.processDynamic = (req, next) => {
  //console.log("Controol: ",req.knowledgeMessage);
  if (!req.knowledgeMessage.topicKeys) return next({data: req.knowledgeMessage.topicKeys, code: 422, messageKeys: ['not-found'] });
  if (!req.knowledgeMessage.coordinates) return next({data: req.knowledgeMessage.coordinates, code: 422, messageKeys: ['not-found'] });
  if (!req.knowledgeMessage.radius) next({ data: req.knowledgeMessage.radius, code: 422, messageKeys: ['not-found'] });

  setTimeout(function() {
    topicDecorator.processDynamic(
      {topicKeys: req.knowledgeMessage.topicKeys, coords: req.knowledgeMessage.coordinates, radius: req.knowledgeMessage.radius},
      function(data){
        next(null, data);
      });
  }, 5000);
}

ctrl.connectEquipments = (req, next) => {
  console.log("Controol: ",req.knowledgeMessage.boardKeys);
  if (!req.knowledgeMessage.boardKeys) return next({data: req.knowledgeMessage.boardKeys, code: 422, messageKeys: ['not-found'] });

  boardDecorator.connectEquipments(req.knowledgeMessage.boardKeys, function(data){
    console.log("update request");
    KnowledgeModel.update({"_id": ObjectId(req.knowledgeMessage.boardKeys[0].boardId)}, {"$set": {"sync": Date.now(), "data.connected": true}})
      .then(data => {
        KnowledgeModel.update({"relations.connectedTo.id": ObjectId(req.knowledgeMessage.boardKeys[0].boardId)}, {"$set": {"sync":  Date.now(), "data.connected": true}})
          .then(data => {
            next(null, data);
          })
          .catch(err => {
            next(err);
          });
      })
      .catch(err => {
        next(err);
      });
  })
}

ctrl.disconnectEquipments = (req, next) => {
  console.log("Controol: ",req.knowledgeMessage.boardKeys);
  if (!req.knowledgeMessage.boardKeys) return next({data: req.knowledgeMessage.boardKeys, code: 422, messageKeys: ['not-found'] });

  boardDecorator.disconnectEquipments(req.knowledgeMessage.boardKeys, function(data){
    console.log("update request");
    KnowledgeModel.update({"_id": ObjectId(req.knowledgeMessage.boardKeys[0].boardId)}, {"$set": {"sync":  Date.now(), "data.connected": false}})
      .then(data => {
        KnowledgeModel.update({"relations.connectedTo.id": ObjectId(req.knowledgeMessage.boardKeys[0].boardId)}, {"$set": {"sync":  Date.now(), "data.connected": false}})
          .then(data => {
            next(null, data);
          })
          .catch(err => {
            next(err);
          });
      })
      .catch(err => {
        next(err);
      });
  })
}

ctrl.startTopic = (req, next) => {
  console.log("topics: ",req.knowledgeMessage.topicKeys);
  if (!req.knowledgeMessage.topicKeys) return next({data: req.knowledgeMessage.topicKeys, code: 422, messageKeys: ['not-found'] });

  topicDecorator.startTopic(req.knowledgeMessage.topicKeys, function(data){
    next(null, data);
  })
}

ctrl.actionRequest = (req, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.knowledgeMessage.equipmentId)) next({ data: req.knowledgeMessage.equipmentID, code: 422, messageKeys: ['not-found'] });
  if (!req.knowledgeMessage.action) next({ data: req.knowledgeMessage.action, code: 422, messageKeys: ['not-found'] });
  if (!req.knowledgeMessage.type) next({ data: req.knowledgeMessage.type, code: 422, messageKeys: ['not-found'] });
  if (!req.knowledgeMessage.data) next({ data: req.knowledgeMessage.data, code: 422, messageKeys: ['not-found'] });
  var actionObject = new Action();
  actionObject.equipmentID = mongoose.Types.ObjectId(req.knowledgeMessage.equipmentId);
  actionObject.action = req.knowledgeMessage.action;
  actionObject.type = req.knowledgeMessage.type;
  actionObject.data = req.knowledgeMessage.data;

  console.log("body: ", actionObject);

  Action.create(actionObject)
    .then(data => {
      console.log("create action start request");
      next(null, data);
    })
    .catch(err => {
      next(err);
    });
};

ctrl.sendMessage = (req, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({data: req.params.id, code: 422, messageKeys: ['not-found'] });
  if (!req.knowledgeMessage) return next({data: req.knowledgeMessage, code: 422, messageKeys: ['not-found'] });

  console.log("ActionModel sendMessage request");
  let messageKnowledge = {};

    messageKnowledge.equipmentID = req.params.id;
    messageKnowledge.action = 'message';
    messageKnowledge.type = 'recipe';
    messageKnowledge.data = {
        active: req.knowledgeMessage.active,
        severity: req.knowledgeMessage.severity,
        startDate: req.knowledgeMessage.startDate,
        releaseDate: req.knowledgeMessage.releaseDate,
        configurations: req.knowledgeMessage.configurations,
        channel: req.knowledgeMessage.channel
    };
    //console.log("Nova Mensagem:  " + JSON.stringify(messageKnowledge));
    Action.create(messageKnowledge)
    .then(data => {
      console.log("sendMessage action request");
      next(null, data);
    })
    .catch(err => {
      next(err);
    });
};
ctrl.updateMessage = (req, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({data: req.params.id, code: 422, messageKeys: ['not-found'] });
  if (!req.knowledgeMessage) return next({data: req.knowledgeMessage, code: 422, messageKeys: ['not-found'] });

  let expression = {}, projection = {};
  for (let q of Object.keys(req.knowledgeMessage)) expression["data."+q] = req.knowledgeMessage[q];

  console.log("updateMessage action request", req.params.id);

  Action.update({"_id": mongoose.Types.ObjectId(req.params.id)}, expression)
    .then(data => {
      console.log("updateMessage action request");
      next(null, data);
    })
    .catch(err => {
      next(err);
    });
};

ctrl.removeMessage = (req, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({data: req.params.id, code: 422, messageKeys: ['not-found'] });
  console.log("Removendo alerta:  " + req.params.id);
  Action.update({"_id": mongoose.Types.ObjectId(req.params.id)},{"data.access": "private"})
    .then(data => {
      console.log("updateMessage action request");
      next(null, data);
    })
    .catch(err => {
      next(err);
    });
};

ctrl.actionRequestFull = (req, res) => {
  Action.create(req.params.id, req.params.type, req.params.action, req.knowledgeMessage)
    .then(data => {
      console.log("create request");
      next(null, data);
    })
    .catch(err => {
      next(err);
    });
};

module.exports = ctrl;
