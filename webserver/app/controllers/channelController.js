'use strict'

var mongoose = require('mongoose');
var Channel = mongoose.model('Knowledge');

const ctrl = {};

ctrl.getChannels = (req, res, next) => {
  console.log(req.params);
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  Channel.find({"type": "association", "subtype": "subscribe", "relations.previous.id": mongoose.Types.ObjectId(req.params.id)}).then(data => {
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getChannel request");
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};


ctrl.channelRequest = (req, res) => {
  Channel.create(req.params.knowledge, req.params.type, req.params.action, req.body)
    .then(data => {
      console.log("create request");
      return res.status(201).send(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};

ctrl.publishUpdates = (req, res) => {
  Channel.publishUpdates(req.params.knowledge, req.body)
    .then(data => {
      console.log("create request");
      return res.status(201).send(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};

ctrl.getChannel = (req, res, next) => {
  if (!req.connectedChannel) next({ data: res, code: 404, messageKeys: ['not-connected']})
  if (!mongoose.Types.ObjectId.isValid(req.params.channel)) return next({ data: req.params.channel, code: 422, messageKeys: ['not-found'] });
  Channel.find({"knowledge": req.params.channel}).then(data => {
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getChannel request");
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

module.exports = ctrl;
