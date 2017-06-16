'use strict'

//const uuid = require('node-uuid');
const https = require('https');
var mongoose = require('mongoose');
var KnowledgeModel = mongoose.model('Knowledge');

const ctrl = {};

/**
*    RETRIEVE
**/

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
  if (!req.query) return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
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

ctrl.getByType = (req, res, next) => {
  if (!req.query) return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  KnowledgeModel.find({"type": req.params.type}).then(data => {
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getByType request");
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

ctrl.getByData = (req, res, next) => {
  if (req.query==="") return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  var query = req.query.columns.split(','), projection = {};
  for (let q in query) projection[query[q]] = 1;
  console.log("getByData request");

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

ctrl.getByLocation = (req, res, next) => {
  if (req.params.lat==="") return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  if (req.params.lng==="") return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  if (req.params.radius==="") return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  //var query = req.query.columns.split(','), projection = {};
  //for (let q in query) projection[query[q]] = 1;
  console.log("getByLocation request");
  var expression = {};

  expression["location"] = {$geoWithin: { $centerSphere: [[ req.params.lat, req.params.lng], req.params.radius/7871100]}};
  if (req.params.type) expression["type"] = req.params.type;
  if (req.params.category) expression["category"] = req.params.category;

  KnowledgeModel.find(expression).then(data => {
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

ctrl.getByRoot = (req, res, next) => {
  if (!req.query) return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  KnowledgeModel.find({"root": req.params.root}).then(data => {
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getByRoot request");
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

/*ctrl.getByCategory = (req, res, next) => {
    KnowledgeModel.find({"category": req.params.category}).then(data => {
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getByCategory request");
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

ctrl.getByCategoryKey = (req, res, next) => {
  KnowledgeModel.find({"owner": req.params.owner, "category": req.params.category}).then(data => {
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getByCategoryKey request");
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};*/


ctrl.getByTypeCategory = (req, res, next) => {
  if (!req.query) return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  KnowledgeModel.find({"type": req.params.type, "category": req.params.category}).then(data => {
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getByTypeCategory request");
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

ctrl.getByRelations = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  if (!req.params.relation) return next({ data: req.params.relation, code: 422, messageKeys: ['not-found'] });
  var expression = {};

  if (Object.keys(req.query).length){
    console.log(req.query);
    expression['sync'] = req.query;
  }

  expression["relations." + req.params.relation] = { $elemMatch: { "id": {$eq: mongoose.Types.ObjectId(req.params.id)}}}
  KnowledgeModel.find(expression).then(data => {
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getRelations request");
    //.once("value", data => {
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

ctrl.getByTypeRelations = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  if (!req.params.relation) return next({ data: req.params.relation, code: 422, messageKeys: ['not-found'] });

  var expression = {};
  expression["type"] = req.params.type;


  if (Object.keys(req.query).length){
    console.log(req.query);
    expression['sync'] = req.query;
  }

      //if (req.params.relation === "connectedTo")
      //expression["relations." + req.params.relation] = {$eq: mongoose.Types.ObjectId(req.params.id)};
  expression["relations." + req.params.relation] = { $elemMatch: { "id": {$eq: mongoose.Types.ObjectId(req.params.id)}}}
  console.log("express: ", expression);

  KnowledgeModel.find(expression).then(data => {
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getByTypeRelations request");
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};


ctrl.getByTypeCategoryRelations = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  if (!req.params.relation) return next({ data: req.params.relation, code: 422, messageKeys: ['not-found'] });
  var expression = {};
  expression["type"] = req.params.type;
  expression["category"] = req.params.category;

  if (Object.keys(req.query).length){
    console.log(req.query);
    expression['sync'] = req.query;
  }
          //if (req.params.relation === "connectedTo")
          //expression["relations." + req.params.relation] = {$eq: mongoose.Types.ObjectId(req.params.id)};

  expression["relations." + req.params.relation] = { $elemMatch: { "id": {$eq: mongoose.Types.ObjectId(req.params.id)}}}
  KnowledgeModel.find(expression).then(data => {
    if (!data) {
      return next({ data: data, code: 404, messageKeys: ['not-found'] });
    }
    console.log("getByTypeCategoryRelations request");
    return res.status(200).json(data);
  })
  .catch(err => {
    console.log("err" + err);
    return next({ data: err, code: 500, messageKeys: ['unexpected-error'] });
  });
};

/**
*    INCLUDES
**/

ctrl.create = (req, res) => {
  if (!req.body) return next({ data: req.body, code: 422, messageKeys: ['not-found'] });
  let newVal = new KnowledgeModel(req.body);
  console.log(newVal);
  KnowledgeModel.create(newVal)
    .then(data => {
      console.log("create request");
      return res.status(201).send(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};

ctrl.createKnowledge = (req, res) => {

  var newKnowledge = new KnowledgeModel();
  newKnowledge.data = req.body;
  newKnowledge.relations = req.params.relations;
  newKnowledge.type    = req.params.type;
  newKnowledge.category = req.params.category;
  newKnowledge.owner   = req.params.owner;

  console.log(newKnowledge);
  KnowledgeModel.create(newKnowledge)
    .then(data => {
      console.log("create request");
      return res.status(201).json(data);
    }).catch(err => {
      return res.status(400).send(err);
    });
};


/**
*    UPDATES
**/

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

ctrl.updateAttribute = (req, res, next) => {
  if (req.params.query==="" || req.params.value==="") return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  //console.log("body: " + JSON.stringify(req.body));
  var expression = {};
  var keys = Object.keys(req.body);
  //console.log("keys: " + JSON.stringify(keys));
  for (let item of keys)
    expression["data."+item] = req.body[item];

  expression["sync"] = Date.now();

  console.log("update request");
  KnowledgeModel.update({_id: req.params.id}, {"$set": expression})
    .then(data => {
      return res.status(200).json(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};

ctrl.pushTopics = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.body.item.topic)) return next({ data: req.body.item.topic, code: 422, messageKeys: ['not-found'] });
    if (!req.body.item.options) return next({ data: req.body.item.options, code: 422, messageKeys: ['not-found'] });

    var subscribeOptions = {
      host: 'api.cloudmqtt.com',
      port: 443,
      path: '/acl',
      headers: {
        'Content-Type': 'application/json'
      },
      auth: 'dqzvavul:gtldwTV1VItA',
      method: 'POST'
    };

    var requestdata = {};
    requestdata.username = req.body.username;
    requestdata.topic = req.body.items.id;
    requestdata.read = (req.body.items.attrs.view);
    requestdata.write = (req.body.items.attrs.publish);

    //console.log(requestdata);

    subscribeOptions.json = true;

    var request = https.request(subscribeOptions, (response) => {
      console.log('STATUS: ' + response.statusCode);
      console.log('HEADERS: ' + JSON.stringify(response.headers));
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        console.log('BODY: ' + JSON.stringify(chunk));
      });

      console.log("Profile id: ", req.body.id);
      console.log("Topic: ", req.body.items);

      var expressions = {}, toPush = {}, pushedItems = [];
      toPush["id"] = mongoose.Types.ObjectId(req.body.items.id);
      for (let attr of req.body.items.attrs) toPush[attr.key] = attr.value;
      pushedItems.push(toPush);

      expressions["relations.subscriberAt"] = { $in: pushedItems};

      KnowledgeModel.update( { _id: req.body.id },
                             { $push: expressions })
        .then(data => {
          console.log("create request 1");

          var expressions = {}, toPush = {}, pushedItems = [];
          toPush["id"] = mongoose.Types.ObjectId(req.body.id);
          for (let attr of req.body.items.attrs) toPush[attr.key] = attr.value;
          pushedItems.push(toPush);
          expressions["relations.subscribedBy"] = { $in: pushedItems};

          KnowledgeModel.update( { _id: req.body.items.id },
                                 { $push: expressions })
            .then(data => {
              console.log("create request 2");
              return res.status(201).json(data);
            }).catch(err => {
              return res.status(400).send(err);
            });
          //return res.status(201).json(data);
        }).catch(err => {
          return res.status(400).send(err);
        });
    });

    request.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
      return res.status(400).send(e.message);
    });
    request.write(JSON.stringify(requestdata));
    request.end();
};

ctrl.pushRelations = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
    if (!req.params.relation) return next({ data: req.params.relation, code: 422, messageKeys: ['not-found'] });
    if (!req.body) return next({ data: req.body, code: 422, messageKeys: ['not-found'] });

    var expression = {};
    expression["relations." + req.params.relation] = {};
    expression["relations." + req.params.relation].id = mongoose.Types.ObjectId(req.body.id);
    if (req.body.view) expression["relations." + req.params.relation].view = req.body.view;
    if (req.body.publish) expression["relations." + req.params.relation].publish = req.body.publish;
    if (req.body.access) expression["relations." + req.params.relation].access = req.body.access;

    KnowledgeModel.update({ _id: req.params.id }, { $push: expression })
      .then(data => {
        console.log("create request");
        return res.status(201).json(data);
      }).catch(err => {
        return res.status(400).send(err);
      });
};
ctrl.pushAttrInfo = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
    if (!req.params.name) return next({ data: req.params.name, code: 422, messageKeys: ['not-found'] });
    if (!req.body) return next({ data: req.body, code: 422, messageKeys: ['not-found'] });

    var expression = {};
    expression["data.info"] = req.body;
    expression["data.info"].name = req.params.name;

    KnowledgeModel.update({ _id: req.params.id }, { $push: expression })
      .then(data => {
        console.log("create request");
        return res.status(201).json(data);
      }).catch(err => {
        return res.status(400).send(err);
      });
};
/**
*    REMOVES
**/

ctrl.pullTopics = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.body.item.topic)) return next({ data: req.body.item.topic, code: 422, messageKeys: ['not-found'] });
  if (!req.body.item.options) return next({ data: req.body.item.options, code: 422, messageKeys: ['not-found'] });


  var deleteOptions = {
    host: 'api.cloudmqtt.com',
    port: 443,
    headers: {
      'Content-Type': 'application/json'
    },
    auth: 'dqzvavul:gtldwTV1VItA',
    path: '/acl',
    json: true,
    body: {"username": req.body.username,"topic": req.body.item.topic},
    method: 'DELETE'
  };

  var requestdel = https.request(deleteOptions, (response) => {
    console.log('STATUSDEL: ' + response.statusCode);
    console.log('HEADERSDEL: ' + JSON.stringify(response.headers));
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      console.log('BODYDEL: ' +  chunk);
    });

    console.log("Profile id: ", req.body.id);
    console.log("Topic: ", req.body.item.topic);

    var expressions = [{},{}];
    expressions[0]["relations.subscriberAt"] = { $in: [{"id": mongoose.Types.ObjectId(req.body.item.topic)}]};
    expressions[1]["relations.subscribedBy"] = { $in: [{"id": mongoose.Types.ObjectId(req.body.id)}]};

    KnowledgeModel.update( { _id: req.body.id },
                           { $pull: expressions[0] })
      .then(data => {
        console.log("create request 1");
        KnowledgeModel.update( { _id: req.body.item.topic },
                               { $pull: expressions[1] })
          .then(data => {
            console.log("create request 2");
            return res.status(201).json(data);
          }).catch(err => {
            return res.status(400).send(err);
          });
        //return res.status(201).json(data);
      }).catch(err => {
        return res.status(400).send(err);
      });

  });

  requestdel.on('error', (e) => {
    console.error(`problem with request delete: ${e.message}`);
    return res.status(400).send(e.message);
  });

  //requestdel.write(JSON.stringify({"username": req.body.username,"topic": req.body.item.topic}));
  requestdel.end();

};

ctrl.pullRelations = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.body.item.id)) return next({ data: req.body.item.topic, code: 422, messageKeys: ['not-found'] });
  if (!req.body.item.options) return next({ data: req.body.item.options, code: 422, messageKeys: ['not-found'] });

  console.log("Profile id: ", req.body.id);
  console.log("Topic: ", req.body.item.id);

  var expressions = {}, pulledItems = [];
  if (req.params.relation === "connectedTo")
    expressions["relations." + req.body.type] = { $in: [mongoose.Types.ObjectId(req.body.items)]};
  else {
    for (let item of req.body.items) pulledItems.push({"id": mongoose.Types.ObjectId(item.id)});
    expressions["relations." + req.body.type] = { $in: pulledItems};
  }

  KnowledgeModel.update( { _id: req.body.id },
                         { $pull: expressions })
    .then(data => {
      console.log("create request");
      return res.status(201).json(data);
    }).catch(err => {
      return res.status(400).send(err);
    });
};

ctrl.remove = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  KnowledgeModel.remove(req.params.id).then(data => {
    console.log("remove request");
    return res.status(200).json(data);
  })
  .catch(err => {
    return next({ data: err, code: 400, messageKeys: ['validation-error'] });
  });
};

ctrl.removeProfile = (req, res) => {
  //var removeQuery = {};
  //removeQuery["category"] = "profile";
  //removeQuery["data.username"] = req.params.username;
  KnowledgeModel.remove({"type": req.params.type, "category": req.params.category, "data.username": req.params.username})
    .then(resultdata => {
      console.log("remove request");
      return res.status(200).json(resultdata);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};

ctrl.removeByRelations = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  if (!req.params.relation) return next({ data: req.params.relation, code: 422, messageKeys: ['not-found'] });
  var expression = {};
  expression["relations." + req.params.relation] = {$eq: mongoose.Types.ObjectId(req.params.id)};
  KnowledgeModel.find(expression).then(data => {
    console.log("remove request");
    return res.status(200).json(data);
  })
  .catch(err => {
    return next({ data: err, code: 400, messageKeys: ['validation-error'] });
  });
}

ctrl.removeAttribute = (req, res , next) => {
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
ctrl.removeAttrInfo = (req, res , next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  if (req.params.attr==="") return next({ data: req.params.attr, code: 422, messageKeys: ['not-found'] });
  if (!req.params.name) return next({ data: req.params.name, code: 422, messageKeys: ['not-found'] });

  var expression = {};
  expression["data.info"] = {"name":req.params.name};
  console.log("delete info request");
  KnowledgeModel.update({_id: req.params.id}, {$pull: expression})
    .then(data => {
      data.query = req.params.query;
      return res.status(200).send(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};
ctrl.removeRelation = (req, res , next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  if (req.params.relation==="") return next({ data: req.params.relation, code: 422, messageKeys: ['not-found'] });
  if (!req.params.relid) return next({ data: req.params.relid, code: 422, messageKeys: ['not-found'] });

  var expression = {};
  expression["relations."+req.params.relation] = {"id": mongoose.Types.ObjectId(req.params.relid)};
  console.log("delete relation request");
  KnowledgeModel.update({_id: req.params.id}, {$pull: expression})
    .then(data => {
      data.query = req.params.query;
      return res.status(200).send(data);
    })
    .catch(err => {
      return res.status(400).send(err);
    });
};

ctrl.removeByTypeCategoryRelations = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next({ data: req.params.id, code: 422, messageKeys: ['not-found'] });
  if (!req.params.relation) return next({ data: req.params.relation, code: 422, messageKeys: ['not-found'] });
  var expression = {};
  expression["type"] = req.params.type;
  expression["category"] = req.params.category;
  expression["relations." + req.params.relation] = {$eq: mongoose.Types.ObjectId(req.params.id)};
  KnowledgeModel.find(expression).then(data => {
    console.log("remove request");
    return res.status(200).json(data);
  })
  .catch(err => {
    return next({ data: err, code: 400, messageKeys: ['validation-error'] });
  });
}

module.exports = ctrl;
