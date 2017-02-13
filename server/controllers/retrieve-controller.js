'use strict'

const Retrieve = require('../models/retrieve-model');
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
  Retrieve.getAll()
      .once("value", data => {
          return res.status(200).send(data.val());
      })
      .catch(err => {
          return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
      });
};

ctrl.getWithKey = (req, res, next) => {
  Retrieve.getWithKey(req.params)
      .once("value", data => {
          return res.status(200).send(data.val());
      })
      .catch(err => {
          return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
      });
};

ctrl.getWithValue = (req, res, next) => {
    Retrieve.getWithValue(req.params)
        .once("value", data => {
            return res.status(200).send(data.val());
        })
        .catch(err => {
            return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
        });
};

ctrl.getInfoWithKey = (req, res, next) => {
    Retrieve.getInfoWithKey(req.params)
        .once("value", data => {
            return res.status(200).send(data.val());
        })
        .catch(err => {
            return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
        });
};

ctrl.getInfoWithoutKey = (req, res, next) => {
    Retrieve.getInfoWithoutKey(req.params)
        .once("value", data => {
            return res.status(200).send(data.val());
        })
        .catch(err => {
            return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
        });
};

module.exports = ctrl;
