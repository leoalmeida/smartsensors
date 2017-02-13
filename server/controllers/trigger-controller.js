'use strict'

const Trigger = require('../models/trigger-model');
const ctrl = {};
const contract = [
        {"Operação": "get", "Comando": "/trigger/contract", "Descrição": "Apresenta informações das APIs disponíveis."},
        {"Operação": "get", "Comando": "/trigger/info/:equipment/withkey/:key", "Descrição": "Apresenta informações coletadas de um sensor específico."},
        {"Operação": "get", "Comando": "/trigger/info/:equipment", "Descrição": "Apresenta informações coletadas de uma categoria de sensores."},
        {"Operação": "get", "Comando": "/trigger/:equipment/withkey/:key", "Descrição": "Apresenta configurações de um equipamento."},
        {"Operação": "get", "Comando": "/trigger/:equipment/withvalue/:key/:value", "Descrição": "Apresenta configurações de vários equipamentos que possuem uma mesma característica."},
        {"Operação": "post", "Comando": "/trigger/:equipment/withkey/:key", "Descrição": "Altera o estado de um equipamento"},
        {"Operação": "put", "Comando": "/trigger/info/:equipment", "Descrição": "Inclui informação de coleta do sensor"},
        {"Operação": "put", "Comando": "/trigger/:equipment/withkey/:key", "Descrição": "Inclui novo equipamento"},
        {"Operação": "delete", "Comando": "/trigger/:equipment/:type/:key", "Descrição": "Remove equipamento"},
    ];

ctrl.getContract = (req, res) => {
    return res.status(200).send(contract);
};

ctrl.getAll = (req, res, next) => {
  Trigger.getAll()
      .once("value", data => {
          return res.status(200).send(data.val());
      })
      .catch(err => {
          return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
      });
};

ctrl.getWithKey = (req, res, next) => {
  Trigger.getWithKey(req.params)
      .once("value", data => {
          return res.status(200).send(data.val());
      })
      .catch(err => {
          return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
      });
};

ctrl.getWithValue = (req, res, next) => {
    Trigger.getWithValue(req.params)
        .once("value", data => {
            return res.status(200).send(data.val());
        })
        .catch(err => {
            return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
        });
};

ctrl.getInfoWithKey = (req, res, next) => {
    Trigger.getInfoWithKey(req.params)
        .once("value", data => {
            return res.status(200).send(data.val());
        })
        .catch(err => {
            return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
        });
};

ctrl.getInfoWithoutKey = (req, res, next) => {
    Trigger.getInfoWithoutKey(req.params)
        .once("value", data => {
            return res.status(200).send(data.val());
        })
        .catch(err => {
            return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
        });
};

ctrl.createInfoWithKey = (req, res, next) => {
    Trigger.createInfoWithKey(req.params, req.body)
        .once("value", data => {
            return res.status(201).send(data.val());
        })
        .catch(err => {
            return next({ data: err, code: 400, messageKeys: ['validation-error'] });
        });
};

ctrl.createWithKey = (req, res, next) => {
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
