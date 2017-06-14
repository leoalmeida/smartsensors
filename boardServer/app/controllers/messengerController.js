'use strict'

var mongoose = require('mongoose');
var Messenger = mongoose.model('Messenger');

const ctrl = {};

ctrl.getMessages = (req, cb) => {
  console.log(req);
  if (!mongoose.Types.ObjectId.isValid(req.id)) cb("Error: Not-found");
  Messenger.find({"type": "association", "subtype": "subscribe", "relations.previous.id": mongoose.Types.ObjectId(req.id)}).then(data => {
    if (!data) {
      cb("Error: Not-found");
    }
    console.log("getChannel request");
    console.log("message sent: ", data);
    cb(data);
  })
  .catch(err => {
    console.log("err" + err);
    cb("err" + err);
  });
};

ctrl.getMessagesByRelations = (req, cb) => {
  if (!mongoose.Types.ObjectId.isValid(req.id)) cb("err: not-found");
  if (!req.relation) rcb("err: not-found");
  var expression = {};
  var quantity = 100;
  var sortIdx = {_id:-1};

  console.log("getRelations request: ", req.query);

  if (req.query.sort && req.query.sortTp)
    sortIdx[req.query.sort] = parseInt(req.query.sortTp);
  if (req.query.limit)
    quantity = parseInt(req.query.limit);
  if (req.query.sync) {
    if (req.query.op)
      expression['sync'][req.query.op] = Number(req.query.sync);
    else
      expression['sync']['$eq'] = Number(req.query.sync);
  }

  expression["relations." + req.relation] = { $elemMatch: { "id": {$eq: mongoose.Types.ObjectId(req.id)}}}
  Messenger.find(expression).sort(sortIdx).limit(quantity).then(data => {
    if (!data) {
      console.log("err: not-found");
      cb("err: not-found");
    }
    console.log("getRelations request");
    //.once("value", data => {
    cb(data);
  })
  .catch(err => {
    console.log("err" + err);
    cb("err" + err);
  });
};

ctrl.saveMessages = (req, cb) => {
  if (!req.body) cb("Error: Not-found");
  let newVal = new Messenger(req.body);
  console.log(newVal);
  Messenger.create(newVal)
    .then(data => {
      console.log("message sent: ", data);
      cb(data);
    })
    .catch(err => {
      console.log("err" + err);
      cb("err" + err);
    });
};

module.exports = ctrl;
