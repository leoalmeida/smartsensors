'use strict'

const router = require('express').Router();

module.exports = function(app){
  const ctrl = app.controllers.profileController;

  //router.post('/login', ctrl.login);
  //router.get('/auth/user', ctrl.getAll);
  //router.get('/auth/user/:id', ctrl.getById);
  router.post('/auth/user', ctrl.createProfile);
  router.put('/auth/user/:id', ctrl.updateProfile);
  router.delete('/auth/user/:id', ctrl.removeProfile);

  return router;
};
