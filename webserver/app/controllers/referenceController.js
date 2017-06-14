'use strict'

var mongoose = require('mongoose');
var ReferenceModel = mongoose.model('Reference');

const ctrl = {};
const contract = [
        {"Operação": "get", "Comando": "smartsensors.herokuapp.com/retrieve/:equipment/withkey/:key", "Descrição": "Apresenta configurações de um equipamento."},
        {"Operação": "get", "Comando": "smartsensors.herokuapp.com/retrieve/:equipment/withvalue/:key/:value", "Descrição": "Apresenta configurações de vários equipamentos que possuem uma mesma característica."},
        {"Operação": "get", "Comando": "smartsensors.herokuapp.com/retrieve/info/:equipment/withkey/:key", "Descrição": "Apresenta informações coletadas de um sensor específico."}
    ];

ctrl.getContract = (req, res, next) => {
    if (contract)
        return res.status(200).send(contract);
    else
        return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });

};

ctrl.getAll = (req, res, next) => {
      ReferenceModel.find({}, (err, data) => {
        console.log("this" + this);
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

ctrl.getByType = (req, res, next) => {
      var query = {};
      query [req.params.type] = 1;
      ReferenceModel.findOne({},query, (err, data) => {
        console.log("this" + this);
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

ctrl.getByTypeSubtype = (req, res, next) => {
  var query = {}, projection = {};
  query [req.params.type] =  {};
  query [req.params.type]["$elemMatch"] = {};
    query [req.params.type]["$elemMatch"]["name"] = req.params.subtype;
    projection[[req.params.type, "$"].join(".")] = 1;
      ReferenceModel.findOne(query,projection, (err, data) => {
        console.log("this" + this);
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

module.exports = ctrl;
