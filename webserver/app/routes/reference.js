'use strict'

var passport = require('passport');
const router = require('express').Router();

module.exports = function(app){
  const ctrl = app.controllers.referenceController;

  router.get('/:name', ctrl.getByName);

  return router;
};
