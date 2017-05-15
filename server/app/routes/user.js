'use strict'

const router = require('express').Router();

module.exports = function(app){
  const ctrl = app.controllers.userController;

  router.post('/login', ctrl.login);
  router.get('/auth/user', ctrl.getAll);
  router.get('/auth/user/:id', ctrl.getById);
  router.post('/auth/user', ctrl.create);
  router.put('/auth/user/:id', ctrl.update);
  router.delete('/auth/user/:id', ctrl.remove);

  return router;
};
