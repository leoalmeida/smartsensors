'use strict'

var mongoose = require('mongoose');
var Action = mongoose.model('Action');

const ctrl = {};

ctrl.getById = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  Action.find({"equipmentID": req.params.id}).then(data => {
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getById request");
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

ctrl.getLastUpdates = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  Action.getLastUpdates(req.params.id, req.params.sync).then(data => {
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getLastUpdates request");
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

/**
*    ACTIONS
**/

ctrl.actionRequest = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.body.equipmentId)) return next({ data: req.body.equipmentID, code: 422, messageKeys: ['not-found'] });
  if (!req.body.action) return next({ data: req.body.action, code: 422, messageKeys: ['not-found'] });
  if (!req.body.type) return next({ data: req.body.type, code: 422, messageKeys: ['not-found'] });
  if (!req.body.data) return next({ data: req.body.data, code: 422, messageKeys: ['not-found'] });
  var actionObject = new Action();
  actionObject.equipmentID = mongoose.Types.ObjectId(req.body.equipmentId);
  actionObject.action = req.body.action;
  actionObject.type = req.body.type;
  actionObject.data = req.body.data;

  console.log("body: ", actionObject);

  Action.create(actionObject)
    .then(data => {
      console.log("create action start request");
      return res.status(202).json(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};

ctrl.sendMessage = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({data: req.params.id, code: 422, messageKeys: ['not-found'] });
  if (!req.body) return next({data: req.body, code: 422, messageKeys: ['not-found'] });

  console.log("ActionModel sendMessage request");
  let messageKnowledge = {};

    messageKnowledge.equipmentID = req.params.id;
    messageKnowledge.action = 'message';
    messageKnowledge.type = 'recipe';
    messageKnowledge.data = {
        active: req.body.active,
        severity: req.body.severity,
        startDate: req.body.startDate,
        releaseDate: req.body.releaseDate,
        configurations: req.body.configurations,
        channel: req.body.channel
    };
    //console.log("Nova Mensagem:  " + JSON.stringify(messageKnowledge));
    Action.create(messageKnowledge)
    .then(data => {
      console.log("sendMessage action request");
      return res.status(202).json(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};

ctrl.updateMessage = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({data: req.params.id, code: 422, messageKeys: ['not-found'] });
  if (!req.body) return next({data: req.body, code: 422, messageKeys: ['not-found'] });

  let expression = {}, projection = {};
  for (let q of Object.keys(req.body)) expression["data."+q] = req.body[q];

  console.log("updateMessage action request", req.params.id);

  Action.update({"_id": mongoose.Types.ObjectId(req.params.id)}, expression)
    .then(data => {
      console.log("updateMessage action request");
      return res.status(202).json(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};

ctrl.removeMessage = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({data: req.params.id, code: 422, messageKeys: ['not-found'] });
  console.log("Removendo alerta:  " + req.params.id);
  Action.update({"_id": mongoose.Types.ObjectId(req.params.id)},{"data.access": "private"})
    .then(data => {
      console.log("updateMessage action request");
      return res.status(202).json(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};

ctrl.actionRequestFull = (req, res) => {
  Action.create(req.params.id, req.params.type, req.params.action, req.body)
    .then(data => {
      console.log("create request");
      return res.status(201).send(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};

module.exports = ctrl;
