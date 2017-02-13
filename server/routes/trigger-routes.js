'use strict'

const router = require('express').Router();
const ctrl = require('../controllers/trigger-controller');

router.get('/trigger/:equipment/:type/with/:keytype/:key', ctrl.getById);
router.post('/trigger/:equipment/:type/with/:keytype/:key', ctrl.update);
router.put('/trigger/:equipment/:type/with/:keytype/:key', ctrl.create);
router.delete('/trigger/:equipment/:type/with/:keytype/:key', ctrl.remove);

module.exports = router;
