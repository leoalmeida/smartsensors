'use strict'

var passport = require('passport');
const router = require('express').Router();


module.exports = function(app){
  const ctrl = app.controllers.actionController;

  router.get('/', ctrl.getById);

  router.post('/equipment/connect',  ctrl.connectEquipments);
  router.post('/equipment/toggle',  ctrl.toggleEquipmentsStatus);
  router.post('/topic/dynamic',  ctrl.processDynamic);


  //router.get('/:id/:sync',  ctrl.getLastUpdates);
  router.post('/start',  ctrl.actionRequest);
  //router.post('/:id',  ctrl.sendMessage);

  router.put('/:id',  ctrl.updateMessage);
  //router.post('/:type/:id/:status', ctrl.statusRequest);

  router.delete('/:id',  ctrl.removeMessage);

  return router;
};
