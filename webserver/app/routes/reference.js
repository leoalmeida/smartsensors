'use strict'

var passport = require('passport');
const router = require('express').Router();

module.exports = function(app){
  const ctrl = app.controllers.referenceController;

  router.get('/', ctrl.getContract);
  router.get('/all', ctrl.getAll);
  router.get('/:type', ctrl.getByType);
  router.get('/:type/:subtype', ctrl.getByTypeSubtype);


  //router.post('/apis/association', passport.authenticate('local-login'), ctrl.create);
  //router.put('/apis/association/:id', passport.authenticate('local-login'), ctrl.update);
  //router.delete('/apis/association/:id', passport.authenticate('local-login'), ctrl.remove);


  //router.post('/apis/object', passport.authenticate('local-login'), ctrl.create);
  //router.put('/apis/object/:id', passport.authenticate('local-login'), ctrl.update);
  //router.delete('/apis/object/:id', passport.authenticate('local-login'), ctrl.remove);


  return router;
};
