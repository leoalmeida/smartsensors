'use strict'

var mongoose = require('mongoose');
var KnowledgeModel = mongoose.model('Knowledge');

const ctrl = {};
const contract = [
        {"Operação": "get", "Comando": "/", "Descrição": "Apresenta contrato da interface."},
        {"Operação": "get", "Comando": "/all", "Descrição": "Apresenta todos os conhecimentos."},
        {"Operação": "get", "Comando": "/all/all/:key", "Descrição": "Apresenta todos os conhecimentos da chava chave solicitada."},
        {"Operação": "get", "Comando": "/all/:subtype", "Descrição": "Apresenta todos os conhecimentos que possuem do sub tipo solicitado."},
        {"Operação": "get", "Comando": "/all/:subtype/:key", "Descrição": "Apresenta todos os conhecimentos da chava chave solicitada que possuem o sub tipo escolhido."},
        {"Operação": "get", "Comando": "/:id", "Descrição": "Apresenta conhecimento com o id solicitado."},
        {"Operação": "get", "Comando": "/:type/all", "Descrição": "Apresenta todos os conhecimentos que possuem o tipo solicitado."},
        {"Operação": "get", "Comando": "/:type/:subtype/all", "Descrição": "Apresenta todos os conhecimentos que possuem o tipo e sub tipo solicitado."},
        {"Operação": "get", "Comando": "/:type/:subtype/:key", "Descrição": "Apresenta todos os conhecimentos que possuem o tipo e sub tipo da chava chave solicitada."},
        {"Operação": "put", "Comando": "/:id", "Descrição": "Altera conhecimento com o id solicitado."},
        {"Operação": "put", "Comando": "/:type/:subtype/all", "Descrição": "Altera todos os conhecimentos de um sub tipo."},
        {"Operação": "put", "Comando": "/:type/:subtype/:key", "Descrição": "Altera todos os conhecimentos de um sub tipo e chave específico."},
        {"Operação": "delete", "Comando": "/:id", "Descrição": "Remove conhecimento com o id solicitado."},
        {"Operação": "delete", "Comando": "/all/:key", "Descrição": "Remove todos os conhecimentos de uma chave específica."},
        {"Operação": "delete", "Comando": "/:type/:subtype/:key", "Descrição": "Remove todos os conhecimentos de um sub tipo e chave específico."},
        {"Operação": "post",   "Comando": "/", "Descrição": "Inclui todos os conhecimentos de um sub tipo e chave específico."}
    ];

ctrl.getContract = (req, res, next) => {
    if (contract)
        return res.status(200).json(contract);
    else
        return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });

};

ctrl.getAll = (req, res, next) => {
  KnowledgeModel.find({}).then(data => {
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getAll request");
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
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

ctrl.getKnowledgeByType = (req, res, next) => {
  KnowledgeModel.find({"type": req.params.type}).then(data => {
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getKnowledgeByType request");
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

ctrl.getKnowledgeBySubtype = (req, res, next) => {
    KnowledgeModel.find({"subtype": req.params.subtype}).then(data => {
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getKnowledgeBySubtype request");
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

ctrl.getKnowledgeByKey = (req, res, next) => {
  KnowledgeModel.find({"key": req.params.key}).then(data => {
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getKnowledgeByKey request");
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

ctrl.getKnowledgeBySubtypeKey = (req, res, next) => {
  KnowledgeModel.find({"key": req.params.key, "subtype": req.params.subtype}).then(data => {
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getKnowledgeBySubtypeKey request");
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

ctrl.getKnowledgeByTypeKey = (req, res, next) => {
  KnowledgeModel.find({"key": req.params.key, "type": req.params.type}).then(data => {
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getKnowledgeByTypeKey request");
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

ctrl.getKnowledgeByTypeSubtype = (req, res, next) => {
  KnowledgeModel.find({"type": req.params.type, "subtype": req.params.subtype}).then(data => {
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getKnowledgeByTypeSubtype request");
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

ctrl.getKnowledgeByTypeSubtypeKey = (req, res, next) => {
  KnowledgeModel.find({"key": req.params.key, "type": req.params.type, "subtype": req.params.subtype}).then(data => {
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getKnowledgeByTypeSubtypeKey request");
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

ctrl.getKnowledgeByData = (req, res, next) => {
  if (req.query==="") return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  var query = req.query.columns.split(','), projection = {};
  for (let q in query) projection[query[q]] = 1;
  console.log("getKnowledgeByData request");

  var expression = {};
  expression[req.params.query] = req.params.value;
  KnowledgeModel.find(expression, projection).then(data => {
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("data" + data);
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

ctrl.remove = (req, res, next) => {
  KnowledgeModel.remove(req.params).then(data => {
    console.log("remove request");
    return res.status(200).json(data);
  })
  .catch(err => {
    return next({ data: err, code: 400, messageKeys: ['validation-error'] });
  });
};

ctrl.create = (req, res) => {
  KnowledgeModel.create(req.params.key, req.params.type, req.params.subtype, req.body)
    .then(data => {
      console.log("create request");
      return res.status(201).send(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};

ctrl.update = (req, res) => {
  KnowledgeModel.update(req.params.id, req.body)
    .then(data => {
      console.log("update request");
      return res.status(200).json(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};

ctrl.updateAttribute = (req, res) => {
  if (req.params.query==="" || req.params.value==="") return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  //console.log("body: " + JSON.stringify(req.body));
  var expression = {};
  var keys = Object.keys(req.body);
  //console.log("keys: " + JSON.stringify(keys));
  for (let item of keys)
    expression["data."+item] = req.body[item];


  console.log("update request");
  KnowledgeModel.update({_id: req.params.id}, {"$set": expression})
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};

ctrl.removeAttribute = (req, res) => {
  if (req.params.query==="") return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  var expression = {};
  expression["data."+req.params.query] = 1;
  console.log("delete request");
  KnowledgeModel.update({_id: req.params.id}, {"$unset": expression})
    .then(data => {
      data.query = req.params.query;
      return res.status(200).send(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};

module.exports = ctrl;
