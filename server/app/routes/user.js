'use strict'

const router = require('express').Router();

module.exports = function(app){
  const ctrl = app.controllers.userController;

  router.get('/apis/user', ctrl.getAll);
  router.get('/apis/user/:id', ctrl.getById);
  router.post('/apis/user', ctrl.create);
  router.put('/apis/user/:id', ctrl.update);
  router.delete('/apis/user/:id', ctrl.remove);

  return router;
};
