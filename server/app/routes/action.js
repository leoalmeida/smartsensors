'use strict'

var passport = require('passport');
const router = require('express').Router();


module.exports = function(app){
  const ctrl = app.controllers.actionController;
  router.get('/', passport.authenticate('local-login'), ctrl.getContract);
  router.get('/:id', passport.authenticate('local-login'), ctrl.getById);
  router.post('/:type/:id/:action', passport.authenticate('local-login'), ctrl.actionRequest);

  return router;
};
