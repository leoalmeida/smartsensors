'use strict'

const router = require('express').Router();
const ctrl = require('../controllers/trigger-controller');

router.get('/trigger/contract', ctrl.getContract);
router.get('/trigger/info/:equipment/withkey/:key', ctrl.getInfoWithKey);
router.get('/trigger/info/:equipment', ctrl.getInfoWithoutKey);
router.get('/trigger/:equipment/withkey/:key', ctrl.getWithKey);
router.get('/trigger/:equipment/withvalue/:key/:value', ctrl.getWithValue);
router.post('/trigger/:equipment/withkey/:key', ctrl.update);
router.put('/trigger/info/:equipment', ctrl.createInfoWithKey);
router.put('/trigger/:equipment/withkey/:key', ctrl.createWithKey);
router.delete('/trigger/:equipment/:type/:key', ctrl.remove);

module.exports = router;
