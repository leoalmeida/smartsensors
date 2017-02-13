'use strict'

const router = require('express').Router();
const ctrl = require('../controllers/retrieve-controller');

router.get('/retrieve', ctrl.getContract);
router.get('/retrieve/info/:equipment/withkey/:key', ctrl.getInfoWithKey);
router.get('/retrieve/info/:equipment', ctrl.getInfoWithoutKey);
router.get('/retrieve/:equipment/withkey/:key', ctrl.getWithKey);
router.get('/retrieve/:equipment/withvalue/:key/:value', ctrl.getWithValue);

module.exports = router;
