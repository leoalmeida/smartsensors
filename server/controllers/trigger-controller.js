'use strict'

const Trigger = require('../models/trigger-model');
const ctrl = {};

ctrl.getAll = (req, res, next) => {
  Trigger.getAll()
      .then(data => {
        return res.status(200).send(data);
      })
      .catch(err => {
        return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
      });
};

ctrl.getById = (req, res, next) => {
  Trigger.getById(req.params)
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
    });
};

ctrl.create = (req, res, next) => {
  Trigger.create(req.params, req.body)
    .once("value", data => {
      return res.status(201).send(data.val());
    })
    .catch(err => {
      return next({ data: err, code: 400, messageKeys: ['validation-error'] });
    });
};

ctrl.update = (req, res, next) => {
  Trigger.update(req.params, req.body)
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      return next({ data: err, code: 400, messageKeys: ['validation-error'] });
    });
};

ctrl.remove = (req, res, next) => {
  Trigger.remove(req.params)
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      return next({ data: err, code: 400, messageKeys: ['validation-error'] });
    });
};

module.exports = ctrl;
