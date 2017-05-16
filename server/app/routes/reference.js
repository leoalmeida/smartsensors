'use strict'

var passport = require('passport');
const router = require('express').Router();

module.exports = function(app){
  const ctrl = app.controllers.referenceController;

  router.get('/', passport.authenticate('local-login'), ctrl.getContract);
  router.get('/all', passport.authenticate('local-login'), ctrl.getAll);
  //router.get('/:type', , passport.authenticate('local-login'), ctrl.getByType);


  //router.post('/apis/association', passport.authenticate('local-login'), ctrl.create);
  //router.put('/apis/association/:id', passport.authenticate('local-login'), ctrl.update);
  //router.delete('/apis/association/:id', passport.authenticate('local-login'), ctrl.remove);


  //router.post('/apis/object', passport.authenticate('local-login'), ctrl.create);
  //router.put('/apis/object/:id', passport.authenticate('local-login'), ctrl.update);
  //router.delete('/apis/object/:id', passport.authenticate('local-login'), ctrl.remove);


  return router;
};
