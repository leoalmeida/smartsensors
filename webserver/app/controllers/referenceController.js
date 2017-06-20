'use strict'

var mongoose = require('mongoose');
var ReferenceModel = mongoose.model('Reference');

const ctrl = {};

ctrl.getByName = (req, res, next) => {
  var query = {};
  query [req.params.type] = 1;

  let refName = req.params.name;

  ReferenceModel.findOne({"name": refName}, (err, data) => {
    console.log("this" + this);
     console.log("err" + err);
     if (err){
        return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
     }
     if (!data) {
       return next({ data: err, code: 404, messageKeys: ['not-found'] });
     }
     console.log(data);
     return res.status(200).json(data)
   });
}

module.exports = ctrl;
