'use strict'

const Transaction = require('../models/transaction-model');
const ctrl = {};

ctrl.getAllFromUser = (req, res, next) => {
  Transaction.getAllFromUserId(req.user._id)
      .then(data => {
        return res.status(200).send(data);
      })
      .catch(err => {
        return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
      });
};


ctrl.getAll = (req, res, next) => {
  Transaction.getAll()
      .then(data => {
        return res.status(200).send(data);
      })
      .catch(err => {
        return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
      });
};

ctrl.getById = (req, res, next) => {
  Transaction.getById(req.params.id)
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
    });
};

ctrl.create = (req, res, next) => {
  Transaction.create(req.body)
    .then(data => {
      return res.status(201).send(data);
    })
    .catch(err => {
      return next({ data: err, code: 400, messageKeys: ['validation-error'] });
    });
};

ctrl.update = (req, res, next) => {
  Transaction.update(req.params.id, req.body)
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      return next({ data: err, code: 400, messageKeys: ['validation-error'] });
    });
};

ctrl.remove = (req, res, next) => {
  Transaction.remove(req.params.id)
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      return next({ data: err, code: 400, messageKeys: ['validation-error'] });
    });
};

module.exports = ctrl;
