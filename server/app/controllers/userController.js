'use strict'

var mongoose = require('mongoose');
var User = mongoose.model('User');
const ctrl = {};

ctrl.createProfile = (req, res) => {
  User.create(req.body)
    .then(data => {
      return res.status(201).send(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};

ctrl.updateProfile = (req, res) => {
  User.update(req.params.id, req.body)
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};


ctrl.removeUser = (req, res) => {
  User.remove(req.params.key)
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};


module.exports = ctrl;
