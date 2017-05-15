'use strict'

const router = require('express').Router();

module.exports = function(app){
  const ctrl = app.controllers.knowledgeController;

  router.get('/', ctrl.getContract);

  router.get('/all', ctrl.getAll);
  router.get('/all/:subtype/:key', ctrl.getKnowledgeBySubtypeKey);
  router.get('/data/:query/:value', ctrl.getKnowledgeByData);
  router.get('/key/:key', ctrl.getKnowledgeByKey);
  router.get('/subtype/:subtype', ctrl.getKnowledgeBySubtype);
  router.get('/type/:type', ctrl.getKnowledgeByType);
  router.get('/type/:type/:key', ctrl.getKnowledgeByTypeKey);

  router.get('/:id', ctrl.getById);
  router.get('/:type/:subtype', ctrl.getKnowledgeByTypeSubtype);
  router.get('/:type/:subtype/:key', ctrl.getKnowledgeByTypeSubtypeKey);

  //router.put('/:id', ctrl.update);
  router.post('/:id', ctrl.updateAttribute);

  router.delete('/:id', ctrl.remove);
  router.delete('/all/:key', ctrl.remove);
  router.delete('/:id/:query', ctrl.removeAttribute);
  router.delete('/:type/:subtype/:key', ctrl.remove);

  router.put('/:type/:subtype/:key', ctrl.create);

  //router.post('/apis/association', ctrl.create);
  //router.put('/apis/association/:id', ctrl.update);
  //router.delete('/apis/association/:id', ctrl.remove);


  //router.post('/apis/object', ctrl.create);
  //router.put('/apis/object/:id', ctrl.update);
  //router.delete('/apis/object/:id', ctrl.remove);


  return router;
};
