'use strict'
var passport = require('passport');

const router = require('express').Router();

module.exports = function(app){
  const ctrl = app.controllers.knowledgeController;

  router.get('/all',  ctrl.getAll);
  router.get('/all/:type',  ctrl.getByType);
  router.get('/all/:type/:category',  ctrl.getByTypeCategory);

  router.get('/data/:query/:value',  ctrl.getByData);
  router.get('/loc/:lat/:lng/:radius',  ctrl.getByLocation);
  router.get('/loc/:lat/:lng/:radius/:type',  ctrl.getByLocation);
  router.get('/loc/:lat/:lng/:radius/:type/:category',  ctrl.getByLocation);
  router.get('/root/:root',  ctrl.getByRoot);
  //router.get('/category/:category',  ctrl.getByCategory);
  //router.get('/:type/:relation/:id',  ctrl.getByCategoryKey);

  router.get('/channels',  ctrl.getChannel);
  router.get('/:id',  ctrl.getById);
  router.get('/:relation/:id',  ctrl.getByRelations);
  router.get('/:type/:relation/:id',  ctrl.getByTypeRelations);
  router.get('/:type/:category/:relation/:id',  ctrl.getByTypeCategoryRelations);

  //router.put('/:id', ctrl.update);
  router.post('/relations/subscribe',  ctrl.pushTopics);
  router.post('/:id/attr/:relation',  ctrl.pushAttrInfo);
  router.post('/:id/relation/:relation',  ctrl.pushRelations);
  router.post('/:id', ctrl.updateAttribute);


  router.delete('/:id',  ctrl.remove);
  router.delete('/relations/unsubscribe',  ctrl.pullTopics);
  router.delete('/relations/:relation',  ctrl.pullRelations);

  router.delete('/:id/:query',  ctrl.removeAttribute);
  router.delete('/:id/attr/:name',  ctrl.removeAttrInfo);
  router.delete('/:id/:relation/:relid',  ctrl.removeRelation);
  router.delete('/:type/:category/:relation/:id',  ctrl.removeByTypeCategoryRelations);

  router.put('/', ctrl.create);
  router.put('/:type/:category/:relation/:id',  ctrl.createKnowledge);

  //router.post('/apis/association', ctrl.create);
  //router.put('/apis/association/:id', ctrl.update);
  //router.delete('/apis/association/:id', ctrl.remove);


  //router.post('/apis/object', ctrl.create);
  //router.put('/apis/object/:id', ctrl.update);
  //router.delete('/apis/object/:id', ctrl.remove);


  return router;
};
