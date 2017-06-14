'use strict'

const router = require('express').Router();


module.exports = function(app){
  const ctrl = app.controllers.retrieveController;
  router.get('/', ctrl.getContract);
  router.get('/info/:equipment/withkey/:key', ctrl.getInfoWithKey);
  router.get('/info/:equipment', ctrl.getInfoWithoutKey);
  router.get('/:equipment/withkey/:key', ctrl.getWithKey);
  router.get('/:equipment/withvalue/:key/:value', ctrl.getWithValue);

  return router;
};
