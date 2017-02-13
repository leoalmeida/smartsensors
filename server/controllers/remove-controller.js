'use strict'

const Remove = require('../models/remove-model');
const ctrl = {};
const contract = [
        {"Operação": "delete", "Comando": "smartsensors.herokuapp.com/remove/:equipment/:type/:key", "Descrição": "Remove equipamento"},
    ];

ctrl.getContract = (req, res, next) => {
    if (contract)
        return res.status(200).send(contract);
    else
        return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });

};

ctrl.remove = (req, res, next) => {
  Remove.remove(req.params)
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      return next({ data: err, code: 400, messageKeys: ['validation-error'] });
    });
};

module.exports = ctrl;
