const router = require('express').Router();

//var file = require('../controllers/fileController');

var loginUtil = require('../utils/loginUtil');

module.exports = function(app){
  var file  = app.controllers.fileController;
/* Router Calls */
  router.post('/', loginUtil.isLoggedIn, file.sendItem);

  router.get('/:id', loginUtil.isLoggedIn, file.getItem);

  return router;

};
