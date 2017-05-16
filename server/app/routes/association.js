'use strict'

var passport = require('passport');
const router = require('express').Router();

module.exports = function(app){
  const ctrl = app.controllers.associationController;

  router.get('/', passport.authenticate('local-login'), ctrl.getContract);
  router.get('/all', passport.authenticate('local-login'), ctrl.getAll);
  //router.get('/bylast/:id/:type', passport.authenticate('local-login'), ctrl.getAssociationsByLastVerticeId);
  //router.get('/bynext/:id/:type', passport.authenticate('local-login'), ctrl.getAssociationsByNextVerticeId);
  router.get('/one/:id', passport.authenticate('local-login'), ctrl.getById);
  router.get('/:key', passport.authenticate('local-login'), ctrl.getByAssociationKey);
  router.get('/:subtype/all', passport.authenticate('local-login'), ctrl.getByType);
  router.get('/:subtype/:key', passport.authenticate('local-login'), ctrl.getByType);
  router.get('/:subtype/last/:id', passport.authenticate('local-login'), ctrl.getAssociationsByLastVerticeId);
  router.get('/:subtype/next/:id', passport.authenticate('local-login'), ctrl.getAssociationsByNextVerticeId);


  //router.post('/apis/association', passport.authenticate('local-login'), ctrl.create);
  //router.put('/apis/association/:id', passport.authenticate('local-login'), ctrl.update);
  //router.delete('/apis/association/:id', passport.authenticate('local-login'), ctrl.remove);


  //router.post('/apis/object', passport.authenticate('local-login'), ctrl.create);
  //router.put('/apis/object/:id', passport.authenticate('local-login'), ctrl.update);
  //router.delete('/apis/object/:id', passport.authenticate('local-login'), ctrl.remove);


  return router;
};
