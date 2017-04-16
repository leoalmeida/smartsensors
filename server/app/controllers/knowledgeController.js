'use strict'

var mongoose = require('mongoose');
var KnowledgeModel = mongoose.model('Knowledge');

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
      KnowledgeModel.find({}, (err, data) => {
         console.log("err" + err);
         if (err){
            return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
         }
         if (!data) {
           return next({ data: err, code: 404, messageKeys: ['not-found'] });
         }
         console.log(data);
         return res.status(200).send(data);
       });
};

ctrl.getById = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] })
  KnowledgeModel.findById(req.params.id, (err, data) => {
      console.log("err" + err);
      if (err){
          return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
      }
      if (!data) {
        return next({ data: data, code: 404, messageKeys: ['not-found'] });
      }
      console.log("data" + data);
      //.once("value", data => {
      return res.status(200).send(data);
  });
};

ctrl.getByType = (req, res, next) => {
  KnowledgeModel.find({ type: req.params.type}, function(err, data) {
    console.log("err" + err);
    if (err){
        return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
    }
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("data" + data);
    //.once("value", data => {
    return res.status(200).send(data);
  });
};

ctrl.getByParentId = (req, res, next) => {
  KnowledgeModel.find({ parent: req.params.parent}, function(err, data) {
    console.log("err" + err);
    if (err){
        return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
    }
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("data" + data);
    //.once("value", data => {
    return res.status(200).send(data);
  });
};


ctrl.getByPrevious = (req, res, next) => {
  KnowledgeModel.find({ previous: req.params.previous}, function(err, data) {
    console.log("err" + err);
    if (err){
        return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
    }
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("data" + data);
    //.once("value", data => {
    return res.status(200).send(data);
  });
};

ctrl.getByNext = (req, res, next) => {
  KnowledgeModel.find({ next: req.params.next}, function(err, data) {
    console.log("err" + err);
    if (err){
        return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
    }
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("data" + data);
    //.once("value", data => {
    return res.status(200).send(data);
  });
};


module.exports = ctrl;
