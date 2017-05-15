'use strict'

const router = require('express').Router();

module.exports = function(app){
  const ctrl = app.controllers.userController;

  router.post('/', ctrl.createProfile);
  router.put('/:id', ctrl.updateProfile);
  router.delete('/:key', ctrl.removeUser);

  return router;
};
