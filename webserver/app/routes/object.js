'use strict'

const router = require('express').Router();

module.exports = function(app){
  const ctrl = app.controllers.objectController;

/*  router.param('id', function(request, response, next, id){
    console.log(
      'Id param was detected: ',
      id
    );
    request.id = id;
    return next();
  });

  router.param('type', function(request, response, next, type){
    console.log(
      'Type param was detected: ',
      type
    );
    request.type = type;
    return next();
  });
*/
  router.get('/', ctrl.getContract);
  router.get('/all', ctrl.getAll);
  //router.get('/bytype/:type', ctrl.getAllFromObjType);
  //router.get('/bykey/:id', ctrl.getById);
  //router.get('/:id', ctrl.getAllFromObjId);

  router.get('/one/:id', ctrl.getById);
  router.get('/:key', ctrl.getAllFromObjKey);
  router.get('/:subtype/all', ctrl.getAllFromObjType);
  router.get('/:subtype/:key', ctrl.getAllFromObjTypeKey);

  //router.post('/apis/association', ctrl.create);
  //router.put('/apis/association/:id', ctrl.update);
  //router.delete('/apis/association/:id', ctrl.remove);


  //router.post('/apis/object', ctrl.create);
  //router.put('/apis/object/:id', ctrl.update);
  //router.delete('/apis/object/:id', ctrl.remove);


  return router;
};
