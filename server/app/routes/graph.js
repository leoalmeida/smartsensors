'use strict'

const router = require('express').Router();

module.exports = function(app){
  const ctrl = app.controllers.graphController;

  router.get('/', ctrl.getContract);
  router.get('/types/:type', ctrl.getAll);
  router.get('/object/:id', ctrl.getObjectItem);
  router.get('/association/:id', ctrl.getAssociationById);
  router.get('/association/:id/is/:type', ctrl.getAssociationsByLastVerticeId);
  router.get('/association/:id/:type', ctrl.getAssociationsByFirstVerticeId);

  //router.post('/apis/association', ctrl.create);
  //router.put('/apis/association/:id', ctrl.update);
  //router.delete('/apis/association/:id', ctrl.remove);


  //router.post('/apis/object', ctrl.create);
  //router.put('/apis/object/:id', ctrl.update);
  //router.delete('/apis/object/:id', ctrl.remove);


  return router;
};
