'use strict'

var passport = require('passport');
const router = require('express').Router();

module.exports = function(app){
  const ctrl = app.controllers.channelController;

  router.get('/:id', ctrl.getChannels);
  router.get('/:id/:channel', ctrl.getChannel);
  router.post('/:type/:knowledge/:channel', ctrl.channelRequest);
  router.post('/:channel', ctrl.publishUpdates);

  return router;
};
