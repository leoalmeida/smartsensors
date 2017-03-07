'use strict'

const Trigger = require('../models/trigger-model');
const ctrl = {};
const contract = [
        {"Operação": "put", "Comando": "smartsensors.herokuapp.com/trigger/info/:equipment", "Descrição": "Inclui informação de coleta do sensor"},
        //{"Operação": "put", "Comando": "smartsensors.herokuapp.com/trigger/:equipment", "Descrição": "Inclui novo equipamento"}
        {"Operação": "post", "Comando": "smartsensors.herokuapp.com/trigger/sinks/withkey/:key", "Descrição": "Altera o estado de um equipamento (body ex: {'connected':true})"},
        {"Operação": "post", "Comando": "smartsensors.herokuapp.com/trigger/sinks/withkey/:key/startboard", "Descrição": "Inicia uma placa de automação!"},
    ];

ctrl.getContract = (req, res, next) => {
    if (contract)
        return res.status(200).send(contract);
    else
        return next({ data: err, code: 400, messageKeys: ['validation-error'] });

};
ctrl.includeNewInfo = (req, res, next) => {
    Trigger.createInfoWithKey(req.params, req.body)
        .once("value", data => {
            return res.status(201).send(data.val());
        })
        .catch(err => {
            return next({ data: err, code: 400, messageKeys: ['validation-error'] });
        });
};

ctrl.createNewEquipment = (req, res, next) => {
  Trigger.createWithKey(req.params, req.body)
    .once("value", data => {
      return res.status(201).send(data.val());
    })
    .catch(err => {
      return next({ data: err, code: 400, messageKeys: ['validation-error'] });
    });
};

ctrl.createWithoutKey = (req, res, next) => {
    Trigger.createWithoutKey(req.params, req.body)
        .once("value", data => {
            return res.status(201).send(data.val());
        })
        .catch(err => {
            return next({ data: err, code: 400, messageKeys: ['validation-error'] });
        });
};

ctrl.updateWithKey = (req, res, next) => {
  Trigger.update(req.params, req.body)
    .then(data => {
      return res.status(200).send(data);
    })
    .catch(err => {
      return next({ data: err, code: 400, messageKeys: ['validation-error'] });
    });
};

ctrl.startBoard  = (req, res) => {
    Trigger.startBoard(req.params, req.body)
        .then(data => {
            return res.status(202).send(data);
        })
        .catch(err => {
            return next(err);
        });
}

module.exports = ctrl;
