'use strict'

var passport = require('passport');
const router = require('express').Router();

module.exports = function(app){
  const ctrl = app.controllers.messengerController;

  router.get('/:channel', ctrl.getChannel);
  router.get('/:relation/:id',  ctrl.getByRelations);
  router.post('/publish', ctrl.publishMessages);

  return router;
};
