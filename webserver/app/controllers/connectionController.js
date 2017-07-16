'use strict'

var mongoose = require('mongoose');
var ConnectionModel = mongoose.model('Connection');
var ObjectId = require('mongodb').ObjectID;

const ctrl = {};

ctrl.getByLocation = (req, res, next) => {
  if (req.params.server==="") return res.status(422).send({ data: req.params.server, code: 422, messageKeys: ['not-found'] });
  if (req.params.lat==="") return res.status(422).send({ data: req.params.lat, code: 422, messageKeys: ['not-found'] });
  if (req.params.lng==="") return res.status(422).send({ data: req.params.lng, code: 422, messageKeys: ['not-found'] });
  //if (req.params.radius==="") return res.status(422).send({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  //var query = req.query.columns.split(','), projection = {};
  //for (let q in query) projection[query[q]] = 1;
  console.log("getByLocation request");
  var expression = {};
  expression["type"] = req.params.server
  expression["access"] = "public";
  expression["available"] = true;
  expression["location"] = {};
  expression["location"]["$nearSphere"] = {}
  expression["location"]["$nearSphere"]["$geometry"] = {type: "Point", coordinates: [req.params.lng, req.params.lat]};
  if (req.params.maxdistance) expression["location"]["$nearSphere"]["$maxDistance"] = req.params.maxdistance/7871100;;
//console.log("Exp: ", expression);
  ConnectionModel.find(expression,{"type" : 1,"name" : 1, "properties" : 1, "statistics": 1, "sync": 1}).limit(1).then(data => {
    if (!data) {
      return res.status(404).send({data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("data" + data);
    return res.status(200).json(data[0]);
  })
  .catch(err => {
    console.log("err" + err);
    return res.status(500).send({data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

ctrl.updateServer = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(422).send({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  if (req.params.status==="") return res.status(422).send({ data: req.params.status, code: 422, messageKeys: ['not-found'] });
  var expression = {};
  expression["available"] = (req.params.status === "connect")?true:false;
  expression["sync"] = Date.now();

  console.log("update request");
  ConnectionModel.update({_id: ObjectId(req.params.id)}, {"$set": expression})
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};

ctrl.addNewServer = (req, res, next) => {
  if (!req.body) return res.status(422).send({ data: req.body, code: 422, messageKeys: ['not-found'] });
  //let newVal = new KnowledgeModel(req.body);
  console.log(req.body);
  ConnectionModel.create(req.body)
    .then(data => {
      console.log("create request");
      return res.status(201).send(data);
    })
    .catch(err => {
      console.log(err);
      return res.status(400).send(err);
    });
}

ctrl.removeServer = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(422).send({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  console.log("remove request");
  ConnectionModel.remove({"_id": ObjectId(req.params.id)}).then(data => {
    return res.status(200).json(data);
  })
  .catch(err => {
    return res.status(400).send({ data: err, code: 400, messageKeys: ['validation-error'] });
  });
}

module.exports = ctrl;
