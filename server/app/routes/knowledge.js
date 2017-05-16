'use strict'
var passport = require('passport');

const router = require('express').Router();

module.exports = function(app){
  const ctrl = app.controllers.knowledgeController;

  router.get('/', passport.authenticate('local-login'), ctrl.getContract);

  router.get('/all', passport.authenticate('local-login'), ctrl.getAll);
  router.get('/all/:subtype/:key', passport.authenticate('local-login'), ctrl.getKnowledgeBySubtypeKey);
  router.get('/data/:query/:value', passport.authenticate('local-login'), ctrl.getKnowledgeByData);
  router.get('/key/:key', passport.authenticate('local-login'), ctrl.getKnowledgeByKey);
  router.get('/subtype/:subtype', passport.authenticate('local-login'), ctrl.getKnowledgeBySubtype);
  router.get('/type/:type', passport.authenticate('local-login'), ctrl.getKnowledgeByType);
  router.get('/type/:type/:key', passport.authenticate('local-login'), ctrl.getKnowledgeByTypeKey);

  router.get('/:id', passport.authenticate('local-login'), ctrl.getById);
  router.get('/:type/:subtype', passport.authenticate('local-login'), ctrl.getKnowledgeByTypeSubtype);
  router.get('/:type/:subtype/:key', passport.authenticate('local-login'), ctrl.getKnowledgeByTypeSubtypeKey);

  //router.put('/:id', ctrl.update);

  router.post('/:id', passport.authenticate('local'), ctrl.updateAttribute);

  router.delete('/:id', passport.authenticate('local-login'), ctrl.remove);
  router.delete('/all/:key', passport.authenticate('local-login'), ctrl.remove);
  router.delete('/:id/:query', passport.authenticate('local-login'), ctrl.removeAttribute);
  router.delete('/:type/:subtype/:key', passport.authenticate('local-login'), ctrl.remove);

  router.put('/:type/:subtype/:key', passport.authenticate('local-login'), ctrl.create);

  //router.post('/apis/association', ctrl.create);
  //router.put('/apis/association/:id', ctrl.update);
  //router.delete('/apis/association/:id', ctrl.remove);


  //router.post('/apis/object', ctrl.create);
  //router.put('/apis/object/:id', ctrl.update);
  //router.delete('/apis/object/:id', ctrl.remove);


  return router;
};
