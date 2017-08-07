'use strict'

var passport = require('passport');
const router = require('express').Router();

module.exports = function(app){
  const ctrl = app.controllers.directoryController;

  router.get('/:server/:lat/:lng', ctrl.getByLocation);
  router.get('/:server/:lat/:lng/:maxdistance', ctrl.getByLocation);

  router.post('/:id/:status', ctrl.updateServer);

  router.put('/', ctrl.addNewServer);

  router.delete('/:serverid', ctrl.removeServer);

  return router;
};
