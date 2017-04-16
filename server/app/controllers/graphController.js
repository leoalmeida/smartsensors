'use strict'

var mongoose = require('mongoose');
var GraphModel = mongoose.model('Graph');

const ctrl = {};
const contract = [
        {"Operação": "get", "Comando": "smartsensors.herokuapp.com/retrieve/:equipment/withkey/:key", "Descrição": "Apresenta configurações de um equipamento."},
        {"Operação": "get", "Comando": "smartsensors.herokuapp.com/retrieve/:equipment/withvalue/:key/:value", "Descrição": "Apresenta configurações de vários equipamentos que possuem uma mesma característica."},
        {"Operação": "get", "Comando": "smartsensors.herokuapp.com/retrieve/info/:equipment/withkey/:key", "Descrição": "Apresenta informações coletadas de um sensor específico."},
        {"Operação": "get", "Comando": "smartsensors.herokuapp.com/retrieve/info/:equipment", "Descrição": "Apresenta informações coletadas de uma categoria de sensores."}
    ];

ctrl.getContract = (req, res, next) => {
    if (contract)
        return res.status(200).send(contract);
    else
        return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });

};

ctrl.getAll = (req, res, next) => {
     GraphModel.getAll(req.params)
      .once("value", data => {
          return res.status(200).send(data.val());
      })
      .catch(err => {
          return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
      });

};

ctrl.getObjectItem = (req, res, next) => {
  GraphModel.getObjectItem(req.params)
      .once("value", data => {
          return res.status(200).send(data.val());
      })
      .catch(err => {
          return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
      });
};

ctrl.getAssociationsByFirstVerticeId = (req, res, next) => {
  GraphModel.getAssociationsByFirstVerticeId(req.params)
      .once("value", data => {
          return res.status(200).send(data.val());
      })
      .catch(err => {
          return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
      });
};

ctrl.getAssociationsByLastVerticeId = (req, res, next) => {
  GraphModel.getAssociationsByLastVerticeId(req.params)
      .once("value", data => {
          return res.status(200).send(data.val());
      })
      .catch(err => {
          return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
      });
};

ctrl.getAssociationById = (req, res, next) => {
  GraphModel.getAssociationsByType(req.params)
      .once("value", data => {
          return res.status(200).send(data.val());
      })
      .catch(err => {
          return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
      });
};

module.exports = ctrl;
