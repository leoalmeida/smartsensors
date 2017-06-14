'use strict'

var passport = require('passport');
const router = require('express').Router();

module.exports = function(app){
  const ctrl = app.controllers.associationController;

  router.get('/',  ctrl.getContract);
  router.get('/all',  ctrl.getAll);
  //router.get('/bylast/:id/:type',  ctrl.getAssociationsByLastVerticeId);
  //router.get('/bynext/:id/:type',  ctrl.getAssociationsByNextVerticeId);
  router.get('/one/:id',  ctrl.getById);
  router.get('/:key',  ctrl.getByAssociationKey);
  router.get('/:subtype/all',  ctrl.getByType);
  router.get('/:subtype/:key',  ctrl.getByType);
  router.get('/:subtype/last/:id',  ctrl.getAssociationsByLastVerticeId);
  router.get('/:subtype/next/:id',  ctrl.getAssociationsByNextVerticeId);


  //router.post('/apis/association',  ctrl.create);
  //router.put('/apis/association/:id',  ctrl.update);
  //router.delete('/apis/association/:id',  ctrl.remove);


  //router.post('/apis/object',  ctrl.create);
  //router.put('/apis/object/:id',  ctrl.update);
  //router.delete('/apis/object/:id',  ctrl.remove);


  return router;
};
