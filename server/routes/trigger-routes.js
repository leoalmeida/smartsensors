'use strict'

const router = require('express').Router();
const ctrl = require('../controllers/trigger-controller');

router.get('/trigger', ctrl.getContract);
//router.put('/trigger/:equipment', ctrl.createNewEquipment);
router.put('/trigger/info/:equipment', ctrl.includeNewInfo);
router.post('/trigger/:equipment/withkey/:key', ctrl.updateWithKey);
router.post('/trigger/sinks/withkey/:key/startboard', ctrl.startBoard);


module.exports = router;
