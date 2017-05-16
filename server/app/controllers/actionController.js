'use strict'

var mongoose = require('mongoose');
var Retrieve = mongoose.model('Action');

const ctrl = {};
const contract = [
        {"Operação": "get", "Comando": "smartsensors.herokuapp.com/action/:type/:id/:action", "Descrição": "Solicita uma ação."}
    ];

ctrl.getContract = (req, res, next) => {
    if (contract)
        return res.status(200).json(contract);
    else
        return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });

};

ctrl.actionRequest = (req, res) => {
  Action.create(req.params.id, req.params.type, req.params.action, req.body)
    .then(data => {
      console.log("create request");
      return res.status(201).send(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};

ctrl.getById = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  KnowledgeModel.findById(req.params.id).then(data => {
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
module.exports = ctrl;
