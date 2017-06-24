'use strict'

var mongoose = require('mongoose');
var Messenger = mongoose.model('Messenger');
var Knowledge = mongoose.model('Knowledge');
var ObjectId = require('mongodb').ObjectID;

const ctrl = {};
const defQuatity = 100;

ctrl.getChannels = (req, res, next) => {
  console.log(req.params);
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(422).send({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  Messenger.find({"type": "association", "subtype": "subscribe", "relations.previous.id": ObjectId(req.params.id)}).then(data => {
    if (!data) {
      return res.status(404).send({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getChannel request");
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return res.status(500).send({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

ctrl.getChannel = (req, res, next) => {
  //if (!req.params.channel) next({ data: res, code: 404, messageKeys: ['not-connected']})
  if (!mongoose.Types.ObjectId.isValid(req.params.channel)) return res.status(422).send({ data: req.params.channel, code: 422, messageKeys: ['not-found'] });
  Messenger.find({"root": req.params.channel}).then(data => {
    if (!data) {
      return res.status(404).send({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getChannel request");
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return res.status(500).send({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

ctrl.getByRelations = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(422).send({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  if (!req.params.relation) return res.status(422).send({ data: req.params.relation, code: 422, messageKeys: ['not-found'] });
  var expression = {};
  var quantity = 100;
  var sortIdx = {_id:-1};

  console.log("getRelations request: ", req.query);

  if (req.query.sort && req.query.sortTp)
    sortIdx[req.query.sort] = parseInt(req.query.sortTp);
  if (req.query.limit)
    quantity = parseInt(req.query.limit);
  if (req.query.sync) {
    expression['sync'] = {};
    if (req.query.op)
      expression['sync'][req.query.op] = Number(req.query.sync);
    else
      expression['sync']['$gt'] = Number(req.query.sync);
  }

  expression["relations." + req.params.relation] = { $elemMatch: { "id": {$eq: ObjectId(req.params.id)}}}
  console.log("getRelations request exp", expression);
  Messenger.find(expression).sort(sortIdx).limit(quantity).then(data => {
    if (!data) {
      return res.status(404).send({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getRelations request");
    //.once("value", data => {
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return res.status(500).send({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

ctrl.publishMessages = (req, res) => {
  if (!req.body) return res.status(422).send({ data: req.body, code: 422, messageKeys: ['not-found'] });
  console.log(req.body);
  let newVal = new Messenger(req.body);
  //console.log(newVal);
  Messenger.create(newVal)
    .then(data => {
      console.log("send message", data);
      Knowledge.update({_id: ObjectId(req.body.root)}, {$set: {sync: Date.now()}, $push: { 'relations.commentedBy': { id: ObjectId(data._id), access: 'public' }}})
        .then(data => {
          console.log("pushRelations request");
          return res.status(201).json(data);
        }).catch(err => {
          return res.status(400).send(err);
        });
    })
    .catch(err => {
      console.log(err);
      return res.status(400).send(err);
    });
};

ctrl.publishUpdates = (req, res) => {
  Messenger.publishUpdates(req.params.channel, req.body)
    .then(data => {
      console.log("create request");
      return res.status(201).send(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};

module.exports = ctrl;
