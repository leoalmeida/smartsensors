'use strict'

const router = require('express').Router();

module.exports = function(app){
  const ctrl = app.controllers.removeController;
  
  router.get('/', ctrl.getContract);
  router.delete('/:equipment/:type/:key', ctrl.remove);

  return router;
};
