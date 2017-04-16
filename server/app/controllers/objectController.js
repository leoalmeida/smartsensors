'use strict'

var mongoose = require('mongoose');
//var ObjectModel = mongoose.model('Object');
//var objectModel = new ObjectModel();
var ObjectModel = mongoose.model('Knowledge');

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
     ObjectModel.find({type: "object"}, (err, data) => {
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
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({ data: data, code: 422, messageKeys: ['not-found'] })
  ObjectModel.findById(req.params.id, (err, data) => {
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

ctrl.getAllFromObjId = (req, res, next) => {
  ObjectModel.find({ key: req.params.id}, function(err, data) {
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

ctrl.getAllFromObjType = (req, res, next) => {
  ObjectModel.find({ subtype: req.params.subtype}, function(err, data) {
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
