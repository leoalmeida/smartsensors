'use strict'

const router = require('express').Router();

module.exports = function(app){
  const ctrl = app.controllers.referenceController;

  router.get('/', ctrl.getContract);
  router.get('/all', ctrl.getAll);
  //router.get('/:type', ctrl.getByType);


  //router.post('/apis/association', ctrl.create);
  //router.put('/apis/association/:id', ctrl.update);
  //router.delete('/apis/association/:id', ctrl.remove);


  //router.post('/apis/object', ctrl.create);
  //router.put('/apis/object/:id', ctrl.update);
  //router.delete('/apis/object/:id', ctrl.remove);


  return router;
};
